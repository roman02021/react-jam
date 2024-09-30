import "./App.css";
import { useMemo, useEffect, useRef, useState } from "react";
import Player from "./components/Player";

import { BlurFilter, TextStyle } from "pixi.js";
import { Stage, Container, Sprite, Text, useApp, useTick } from "@pixi/react";

const App = () => {
    const blurFilter = useMemo(() => new BlurFilter(2), []);
    const bunnyUrl = "https://pixijs.io/pixi-react/img/bunny.png";

    return (
        <Stage width={800} height={600} options={{ background: 0x1099bb }}>
            <Player></Player>
        </Stage>
    );
};

export default App;
