import { Texture } from "pixi.js";

export interface TileBody {
    x: number;
    y: number;
    width?: number;
    height?: number;
}

export interface Position {
    x: number;
    y: number;
}

export interface CollisionTile {
    width: number;
    height: number;
    x: number;
    y: number;
}

export interface AnimationSpritesheet {
    columns: number;
    image: string;
    imageheight: number;
    imagewidth: number;
    margin: number;
    name: string;
    spacing: number;
    tilecount: number;
    tileheight: number;
    tilewidth: number;
    type: string;
    version: string;
}

interface Tile {
    id: number;
    image: string;
    imageheight: number;
    imagewidth: number;
    properties: AnimationFrameProperty[];
    type: string;
}
export interface PlayerAnimations {
    idle: Texture[];
    running: Texture[];
    jump: Texture[];
    attack1: Texture[];
    attack2: Texture[];
}
interface AnimationFrameProperty {
    name: string;
    type: string;
    value: string;
}

export interface AnimationTiles {
    tiles: Tile[];
    tilewidth: number;
    tileheight: number;
    tilecount: number;
}

interface Layer {
    data: number[];
    height: number;
    id: number;
    name: string;
    opacity: number;
    type: string;
    visible: boolean;
    width: number;
    x: number;
    y: number;
}

export interface AtlasData {
    height: number;
    layers: Layer;
}

// export interface Physics {
//     setPlatformTiles: useState() => void;
//     setPlayerPosition;
//     isColliding;
// }
