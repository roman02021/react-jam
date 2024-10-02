import React, { useRef, useState } from "react";
import {
    Stage,
    Container,
    useTick,
    AnimatedSprite,
    _ReactPixi,
} from "@pixi/react";
import { Texture, Spritesheet, Assets } from "pixi.js";
import { useEffect } from "react";
import CharSpriteSheet from "../assets/char/spirtesheet.json";
import CharRunSpriteSheet from "../assets/run/spirtesheet.json";
import Matter, { Body } from "matter-js";

interface Props {
    engine: Matter.Engine;
    stage: Stage;
}

function Player({ engine, stage }: Props) {
    const [idleTextures, setIdleTextures] = useState<Texture[]>([]);
    const [runTextures, setRunTextures] = useState<Texture[]>([]);

    const [playerX, setPlayerX] = useState<number>(10);
    const [playerY, setPlayerY] = useState<number>(-100);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const containerRef = useRef<_ReactPixi.IContainer | null>();
    const [heroBody, setHeroBody] = useState<Matter.Body>();

    const [isColliding, setIsColliding] = useState(false);

    const documentRef = useRef(document);

    function moveRight() {
        // setPlayerX((playerX) => playerX + 10);
        if (heroBody && stage) {
            console.log("moveRight", playerX, heroBody.position);
            heroBody.position.x += 0.5;
            // Matter.Body.applyForce(heroBody, heroBody.position, {
            //     x: 0.01,
            //     y: 0,
            // });
        }
    }

    function moveLeft(moveBy: number) {
        if (heroBody) {
            Matter.Body.setVelocity(heroBody, { x: -2, y: 0 });
        }
    }

    async function loadIdleTextures() {
        const ss = new Spritesheet(
            Texture.from(CharSpriteSheet.meta.image),
            CharSpriteSheet
        );

        await ss.parse();

        setIdleTextures(ss.animations["Idle-Sheet"]);
    }

    async function loadRunningTextures() {
        const ss = new Spritesheet(
            Texture.from(CharRunSpriteSheet.meta.image),
            CharRunSpriteSheet
        );

        await ss.parse();
        setRunTextures(ss.animations["Run-Sheet"]);
    }

    function addPhysicsToHero() {
        const body = Matter.Bodies.rectangle(playerX, playerY, 64, 80, {
            friction: 0.5,
            mass: 100000,

            label: "HERO",
        });
        setHeroBody(body);

        if (engine) {
            Matter.Composite.add(engine.world, body);
        }
    }

    useTick((delta) => {
        stage.current.app.stage.position.x = -heroBody.position.x;
    });

    let testBody: Matter.Body;

    useEffect(() => {
        const body = Matter.Bodies.rectangle(playerX, playerY, 48, 35, {
            friction: 0,
            label: "HERO",
        });
        setHeroBody(body);

        if (engine) {
            Matter.Composite.add(engine.world, body);

            function handleCollision(e) {
                // console.log("!!! COLIDING", e);
                // setHeroBody({ ...testBody, velocity: { x: 0, y: 0 } });
                // containerRef.current.y = 100;
                // containerRef.current.x = 100;
                setIsColliding(true);
                console.log(e, "EVA", e.pairs);
                if (heroBody) {
                    heroBody.isStatic = true;
                    // heroBody.position.y = e.paris.where
                    e.pairs.forEach((pair) => {
                        console.log(pair);
                    });
                }
            }

            if (engine) {
                Matter.Events.on(engine, "collisionActive", handleCollision);
            }
        }
    }, [engine]);

    useEffect(() => {
        loadIdleTextures();
        loadRunningTextures();
        // addPhysicsToHero();
    }, []);

    useEffect(() => {
        if (playerX !== 10) {
            setIsRunning(true);
        }
    }, [playerX, playerY]);

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
            moveLeft(10);
        } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
            moveRight();
        }
    }

    useEffect(() => {
        documentRef.current.addEventListener("keydown", handleKeyDown, true);

        return () => {
            documentRef.current.removeEventListener("keydown", handleKeyDown);
        };
    }, [heroBody]);

    useTick((delta) => {
        if (
            heroBody &&
            containerRef.current !== undefined &&
            containerRef.current !== null
        ) {
            containerRef.current.x = heroBody.position.x;
            if (!isColliding) {
                engine.gravity.x = 0;
                containerRef.current.y = heroBody.position.y;
            }

            // setHeroBody({
            //     ...heroBody,
            //     position: {
            //         x: containerRef.current.x,
            //         y: containerRef.current.y,
            //     },
            // });
            // heroBody.position.x = containerRef.current.x;
            // heroBody.position.y = containerRef.current.y;
            // setHeroBody({
            //     ...heroBody,
            //     position: {
            //         x: containerRef.current.x + 0.01,
            //         y: containerRef.current.y + 0.1,
            //     },
            // });
        }
        // console.log(heroBody?.position);
        // this.sprite.x = this.body.position.x - this.sprite.width / 2;
        // this.sprite.y = this.body.position.y - this.sprite.height / 2;
        // console.log(heroBody?.position);
        if (testBody) {
            // console.log(heroBody?.position.y, testBody.position.y, "yoo");
        }
    });

    return (
        <Container x={playerX} y={playerY} ref={containerRef}>
            {idleTextures.length > 0 && !isRunning && (
                <AnimatedSprite
                    textures={idleTextures}
                    isPlaying={true}
                    animationSpeed={0.075}
                />
            )}
            {runTextures.length > 0 && isRunning && (
                <AnimatedSprite
                    textures={runTextures}
                    isPlaying={true}
                    animationSpeed={0.075}
                />
            )}
        </Container>
    );
}

export default Player;
