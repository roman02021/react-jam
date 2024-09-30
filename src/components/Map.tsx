import React from "react";
import { Texture, Spritesheet, Assets } from "pixi.js";
import { Sprite } from "@pixi/react";
import map from "../assets/map/map.png";

function Map() {
    return <Sprite image={map}></Sprite>;
}

export default Map;
