import { Texture, Rectangle, BaseTexture } from "pixi.js";
import mapBaseImg from "../assets/map/mapBase.png";
import { CollisionTile } from "../types";

interface Chunk {
    data: number[];
    height: number;
    width: number;
    x: number;
    y: number;
}

interface Object {
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    visible: boolean;
    type: string;
    id: number;
    rotation: number;
}

interface Layer {
    chunks?: Chunk[];
    height: number;
    width: number;
    x: number;
    y: number;
    startx: number;
    starty: number;
    name: string;
    opacity: number;
    type: string;
    objects?: Object[];
}

export interface MapAtlas {
    tilewidth: number;
    tileheight: number;
    width: number;
    height: number;
    layers: Layer[];
    infinite: boolean;
    compressionlevel: number;
    version: string;
    type: string;
    orientation: string;
    renderorder: string;
    nextobjectid: number;
    tilesets: any[];
    nextlayerid: number;
    tiledversion: string;
}

export interface MapTile {
    texture: Texture;
    x: number;
    y: number;
    id: number;
}

const TILE_MAP_WIDTH = 25;

export function loadMap(mapAtlas: MapAtlas) {
    // const loadedSs = await Assets.load("./map/platforms-map.json");
    const baseText = BaseTexture.from(mapBaseImg);

    console.log(baseText);

    const mapTiles: MapTile[] = [];
    const collisionTiles: CollisionTile[] = [];

    console.log(mapAtlas);

    mapAtlas.layers.forEach((layer) => {
        layer.chunks?.forEach((chunk, chunkIndex) => {
            if (chunk.data.length > 0) {
                for (let i = 0; i < chunk.data.length; i++) {
                    const id = chunk.data[i];
                    const yTile = Math.floor(id / TILE_MAP_WIDTH);
                    const xTile = id % TILE_MAP_WIDTH;

                    const tex = new Texture(
                        baseText,
                        new Rectangle(
                            (xTile - 1) * mapAtlas.tilewidth,
                            yTile * mapAtlas.tileheight,
                            mapAtlas.tilewidth,
                            mapAtlas.tileheight
                        )
                    );

                    // const chunkXOffest = chunkIndex * chunk.width * 16;
                    const chunkXOffest = chunk.x * chunk.width;
                    const xOffset = chunkXOffest + (i % 16) * 16;
                    const yOffset = Math.floor(i / 16) * 16;

                    console.log(chunkXOffest);

                    if (id !== 0) {
                        mapTiles.push({
                            texture: tex,
                            x: xOffset,
                            y: yOffset,
                            id: id,
                        });
                    }
                }
            }
        });
        if (layer.name === "Platforms") {
            layer.objects?.forEach((collisionObject) => {
                console.log;
                collisionTiles.push(collisionObject);
            });
        }
    });

    return { mapTiles, collisionTiles };

    // for (let y = 0; y < mapAtlas.height; y++) {
    //     for (let x = 0; x < mapAtlas.width; x++) {
    //         const id = x + ss.width * y;
    //     }
    //     for (let x = 0; x < ss.width; x++) {
    //         const id = x + ss.width * y;
    //         const yTile = Math.floor(ss.layers[0].data[id] / 25);
    //         const xTile = ss.layers[0].data[id] % 25;

    //         const tex = new Texture(
    //             mapBaseImg,
    //             new Rectangle(
    //                 -16 + xTile * 16,
    //                 yTile * 16,
    //                 ss.tilewidth,
    //                 ss.tileheight
    //             )
    //         );

    //         // console.log(y, y * 16, id, ss.layers[0].data[id]);

    //         //TODO: pories preco tam mas - 16

    //         if (ss.layers[0].data[id] !== 0) {
    //             addPhysicsToTile(x * 16, y * 16);
    //             tempMapTextures.push([tex, x * 16, y * 16]);
    //         }
    //     }
    // }
}
