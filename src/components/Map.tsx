import React, { useRef, useEffect, useState } from "react";
import { Texture, Spritesheet, Assets, BaseTexture, Rectangle } from "pixi.js";
import { Container, Sprite, useTick } from "@pixi/react";
import map from "../assets/map/map.png";
import Matter from "matter-js";

interface Props {
    engine: Matter.Engine;
}
interface Tile {
    id: string;
    x: number;
    y: number;
}
interface Layer {
    collider: boolean;
    name: string;
    tiles: Tile[];
}

interface TileMap {
    mapHeight: number;
    mapWidth: number;
    tileSize: 16;
    layers: Layer[];
}

interface TileData {
    texture: Texture;
    x: number;
    y: number;
}

function Map({ engine }: Props) {
    const refA = useRef(null);
    const [ss, setSs] = useState<TileMap>();
    const [mapTextures, setMapTextures] = useState<TileData[]>([]);
    const [tileBodies, setTileBodies] = useState<Matter.Body[]>([]);

    function addPhysicsToTile(x: number, y: number) {
        const body = Matter.Bodies.rectangle(x, y + 218, 16, 16, {
            friction: 0.01,
            isStatic: true,
        });

        console.log(body.position, "TILE POS");
        if (engine) {
            // console.log(body);
            Matter.Composite.add(engine.world, body);
            setTileBodies((tileBodies) => [...tileBodies, body]);
        }
    }

    useEffect(() => {
        async function loadSpriteSheet() {
            const loadedSs = await Assets.load("./map/map.json");
            setSs(loadedSs);
        }
        loadSpriteSheet();
    }, []);

    // useEffect(() => {
    //     function handleCollision(e) {
    //         console.log("COLIDING !!!!!!!!!", e);
    //     }

    //     console.log(Matter, "yoooo", engine);
    //     if (engine) {
    //         Matter.Events.on(engine, "collisionActive", handleCollision);
    //         console.log("ADDED LISTENER");
    //     }
    // }, [engine]);

    useEffect(() => {
        if (ss) {
            const baseText = new BaseTexture("./map/spritesheet.png");
            const tempMapTextures: TileData[] = [];
            ss.layers.reverse().forEach((s) => {
                s.tiles.forEach((tile) => {
                    // console.log(tile, "x:", tile.x, "y:", tile.y);
                    const yTile = Math.floor(Number(tile.id) / 8);
                    const xTile = Number(tile.id) % 8;
                    // console.log("xTile:", xTile, "yTile:", yTile);
                    const tex = new Texture(
                        baseText,
                        new Rectangle(
                            xTile * 16,
                            yTile * 16,
                            ss.tileSize,
                            ss.tileSize
                        )
                    );
                    addPhysicsToTile(xTile * 16, yTile * 16);
                    tempMapTextures.push([tex, tile.x, tile.y]);
                });
            });
            setMapTextures(tempMapTextures);

            function handleCollision(e) {
                // console.log("COLIDING !!!!!!!!!", e);
            }

            console.log(Matter, "yoooo", engine);
            if (engine) {
                Matter.Events.on(engine, "collisionActive", handleCollision);
                console.log("ADDED LISTENER");
            }
        }
    }, [ss]);

    useTick((delta) => {
        // console.log("delta:", tileBodies);
    });

    return (
        <Container x={0} y={208}>
            {mapTextures.length > 0 &&
                mapTextures.map((x, ind) => (
                    <>
                        <Sprite
                            key={ind}
                            texture={x[0]}
                            y={x[2] * 16}
                            x={x[1] * 16}
                        />
                    </>
                ))}
        </Container>
    );
}

export default Map;
