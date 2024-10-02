import React, { useRef, useEffect, useState, useCallback } from "react";
import { Texture, Spritesheet, Assets, BaseTexture, Rectangle } from "pixi.js";
import * as PIXI from "pixi.js";
import { Container, Graphics, Sprite, useTick } from "@pixi/react";
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

function RectangleFunc(props) {
    const draw = useCallback(
        (g) => {
            g.clear();
            g.beginFill(props.color);
            g.drawRect(props.x, props.y, props.width, props.height);
            g.endFill();
        },
        [props]
    );

    return <Graphics draw={draw} />;
}

function Map({ engine }: Props) {
    const refA = useRef(null);
    const [ss, setSs] = useState<TileMap>();
    const [mapTextures, setMapTextures] = useState<TileData[]>([]);
    const [tileBodies, setTileBodies] = useState<Matter.Body[]>([]);

    function addPhysicsToTile(x: number, y: number) {
        const body = Matter.Bodies.rectangle(x, y, 16, 16, {
            friction: 0,
            isStatic: true,
            frictionStatic: 0,
        });

        if (engine) {
            Matter.Composite.add(engine.world, body);
            setTileBodies((tileBodies) => [...tileBodies, body]);
        }
    }

    useEffect(() => {
        async function loadSpriteSheet() {
            // const sprites = new Spritesheet(Texture.from);
            const loadedSs = await Assets.load("./map/map.json");
            setSs(loadedSs);
        }
        loadSpriteSheet();
    }, []);

    useEffect(() => {
        if (ss) {
            const baseText = new BaseTexture("./map/spritesheet.png");
            console.log(baseText, ss);
            // baseText.setSize(ss.mapWidth * 16, ss.mapHeight * 16, 1);
            const tempMapTextures: TileData[] = [];
            ss.layers.reverse().forEach((s) => {
                console.log(s);
                s.tiles.forEach((tile) => {
                    const yTile = Math.floor(Number(tile.id) / 8);
                    const xTile = Number(tile.id) % 8;

                    console.log(
                        yTile,
                        xTile,
                        tile.x,
                        Number(tile.id) % 8,
                        tile.id,
                        tile.y
                    );

                    const tex = new Texture(
                        baseText,
                        new Rectangle(xTile * 16, yTile * 16, 16, 16)
                    );
                    console.log(tex, "TEXT");

                    addPhysicsToTile(tile.x * 16, tile.y * 16);
                    tempMapTextures.push([tex, tile.x * 16, tile.y * 16]);
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

    console.log(mapTextures);
    console.log(tileBodies);

    useTick((delta) => {});

    return (
        <Container x={0} y={0}>
            {/* {mapTextures.length > 0 && (
                <>
                    <Sprite
                        texture={mapTextures[0][0]}
                        y={mapTextures[0][2]}
                        x={mapTextures[0][1]}
                    />
                    <Sprite
                        texture={mapTextures[1][0]}
                        y={mapTextures[1][2]}
                        x={mapTextures[1][1]}
                    />
                </>
            )} */}
            {mapTextures.length > 0 &&
                mapTextures.map((x, ind) => (
                    <>
                        <Sprite key={ind} texture={x[0]} y={x[2]} x={x[1]} />
                        {/* <RectangleFunc
                            x={x[1]}
                            y={x[2]}
                            width={16}
                            height={16}
                            color={0xff0000}
                        /> */}
                    </>
                ))}
        </Container>
    );
}

export default Map;
