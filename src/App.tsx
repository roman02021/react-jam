import "./App.css";
import { useMemo, useEffect, useRef, useState } from "react";
import Player from "./components/Player";
import Map from "./components/Map";
import * as Matter from "matter-js";

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

const App = () => {
    const blurFilter = useMemo(() => new BlurFilter(2), []);
    const bunnyUrl = "https://pixijs.io/pixi-react/img/bunny.png";
    const [physics, setPhysics] = useState<Matter.Engine>();

    const containerRef = useRef(null);

    useEffect(() => {
        const physic = Matter.Engine.create();
        setPhysics(physic);
        const runner = Matter.Runner.create();
        Matter.Runner.run(runner, physic);

        const body = Matter.Bodies.rectangle(
            -10,
            200,
            containerRef.current?.width / 2,
            containerRef.current?.height / 2,
            { friction: 0.01, isStatic: true }
        );
        const body2 = Matter.Bodies.rectangle(10, 100, 64, 80, {
            friction: 0.01,
            isStatic: true,
        });
        Matter.World.add(physic.world, body);
        Matter.World.add(physic.world, body2);
        console.log(body, "ayo");
    }, []);

    console.log(containerRef, containerRef.current?.width);

    return (
        <Stage width={500} height={300} options={{ background: 0x1099bb }}>
            <Player></Player>
            <Container x={-10} y={208} ref={containerRef}>
                <Map />
            </Container>
        </Stage>
    );
};

export default App;
