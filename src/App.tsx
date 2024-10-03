import "./App.css";
import { useMemo, useEffect, useRef, useState } from "react";
import Player from "./components/Player";
import Map from "./components/Map";

import { BlurFilter, TextStyle } from "pixi.js";
import {
    Stage,
    Container,
    Sprite,
    Text,
    useApp,
    useTick,
    _ReactPixi,
} from "@pixi/react";
import usePhysics from "./hooks/usePhysics";
import { TileBody } from "./types";

const App = () => {
    const blurFilter = useMemo(() => new BlurFilter(2), []);
    const bunnyUrl = "https://pixijs.io/pixi-react/img/bunny.png";
    const [platformTiles, setPlatformTiles] = useState<TileBody[]>([]);
    const [playerPosition, setPlayerPosition] = useState<TileBody>();
    const [isColliding, setIsColliding] = useState<boolean>(false);

    const containerRef = useRef(null);
    const stageRef = useRef(null);

    // console.log(containerRef, containerRef.current?.width);
    // if (stageRef.current) {
    //     console.log(stageRef.current);
    // }

    return (
        <Stage
            ref={stageRef}
            width={500}
            height={500}
            options={{ background: 0x1099bb }}
        >
            <Container y={250}>
                <Player
                    setPlayerPosition={setPlayerPosition}
                    isColliding={isColliding}
                    platformTiles={platformTiles}
                    setIsColliding={setIsColliding}
                    stage={stageRef}
                ></Player>
                <Map
                    setPlatformTiles={setPlatformTiles}
                    platformTiles={platformTiles}
                />
            </Container>
        </Stage>
    );
};

export default App;
