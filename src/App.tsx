import "./App.css";
import { useMemo, useEffect, useRef, useState } from "react";
import Player from "./components/Player";
import Map from "./components/Map";

import { BlurFilter, TextStyle } from "pixi.js";
import { Stage, Container, _ReactPixi } from "@pixi/react";
import usePhysics from "./hooks/usePhysics";
import { TileBody } from "./types";

interface Position {
    x: number;
    y: number;
}

const App = () => {
    const blurFilter = useMemo(() => new BlurFilter(2), []);
    const bunnyUrl = "https://pixijs.io/pixi-react/img/bunny.png";
    const [platformTiles, setPlatformTiles] = useState<TileBody[]>([]);
    const [playerPosition, setPlayerPosition] = useState<TileBody>();
    const [isColliding, setIsColliding] = useState<boolean>(false);
    const [cameraPosition, setCameraPosition] = useState<Position>({
        x: 0,
        y: 0,
    });

    const containerRef = useRef(null);
    const stageRef = useRef(null);

    // console.log(containerRef, containerRef.current?.width);
    // if (stageRef.current) {
    //     console.log(stageRef.current);
    // }

    // console.log(cameraPosition, "YOOO");

    return (
        <Stage
            ref={stageRef}
            width={500}
            height={400}
            options={{ background: 0x1099bb }}
        >
            <Container x={cameraPosition.x} y={cameraPosition.y}>
                <Map
                    setPlatformTiles={setPlatformTiles}
                    platformTiles={platformTiles}
                />
                <Player
                    setPlayerPosition={setPlayerPosition}
                    isColliding={isColliding}
                    platformTiles={platformTiles}
                    setIsColliding={setIsColliding}
                    setCameraPosition={setCameraPosition}
                    cameraPosition={cameraPosition}
                ></Player>
            </Container>
        </Stage>
    );
};

export default App;
