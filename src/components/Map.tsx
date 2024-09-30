import React, { useRef } from "react";
import { Texture, Spritesheet, Assets } from "pixi.js";
import { Sprite } from "@pixi/react";
import map from "../assets/map/map.png";

function Map() {
    const refA = useRef(null);
    return <Sprite ref={refA} image={map}></Sprite>;
}

export default Map;
