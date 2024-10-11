import { useRef, useEffect, useState, useCallback } from "react";
import { Texture } from "pixi.js";
import { Container, Graphics, Sprite, useTick } from "@pixi/react";
import { TileBody } from "../types";
import mapAtlas from "../assets/map/platforms-map.json";
import { loadMap, MapTile } from "../system/loadMap";

interface Props {
    engine: object;
    platformTiles: TileBody[];
    setPlatformTiles: any;
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

function Map({ platformTiles, setPlatformTiles }: Props) {
    const refA = useRef(null);
    const [ss, setSs] = useState<TileMap>();
    const [mapTextures, setMapTextures] = useState<MapTile[]>([]);
    const [tileBodies, setTileBodies] = useState<TileBody[]>([]);

    function addPhysicsToTile(
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        const tileBody: TileBody = {
            x: x,
            y: y,
            width: width,
            height: height,
        };
        // setTileBodies((tileBodies) => [...tileBodies, tileBody]);
        setPlatformTiles((platformTiles) => [...platformTiles, tileBody]);
    }

    useEffect(() => {
        console.log(mapAtlas);
        const { mapTiles, collisionTiles } = loadMap(mapAtlas);
        setMapTextures(mapTiles);
        collisionTiles.forEach((tile) => {
            addPhysicsToTile(tile.x, tile.y + 256, tile.width, tile.height);
        });
    }, []);

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
                mapTextures.map((mapTile, ind) => (
                    <>
                        <Sprite
                            key={ind}
                            texture={mapTile.texture}
                            y={mapTile.y}
                            x={mapTile.x}
                        />
                        {/* <RectangleFunc
                            x={x[1]}
                            y={x[2]}
                            width={16}
                            height={16}
                            color={0xff0000}
                        />*/}
                    </>
                ))}
        </Container>
    );
}

export default Map;
