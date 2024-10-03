import React, { useRef, useState } from "react";
import {
    Stage,
    Container,
    useTick,
    AnimatedSprite,
    _ReactPixi,
} from "@pixi/react";
import { Texture, Spritesheet } from "pixi.js";
import { useEffect } from "react";
import CharSpriteSheet from "../assets/char/spirtesheet.json";
import CharRunSpriteSheet from "../assets/run/spirtesheet.json";

interface Props {
    stage: Stage;
    engine: object;
}
enum MovementDirection {
    Idle = "idle",
    Left = "left",
    Right = "right",
    Up = "up",
    Down = "down",
}

function Player({
    setPlayerPosition,
    isColliding,
    stage,
    engine,
    platformTiles,
    setIsColliding,
}: Props) {
    const [idleTextures, setIdleTextures] = useState<Texture[]>([]);
    const [runTextures, setRunTextures] = useState<Texture[]>([]);

    const [playerX, setPlayerX] = useState<number>(10);
    const [playerY, setPlayerY] = useState<number>(-100);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [movementDirection, setMovementDirection] =
        useState<MovementDirection>(MovementDirection.Idle);

    const containerRef = useRef<_ReactPixi.IContainer | null>();

    // const [isColliding, setIsColliding] = useState(false);

    const documentRef = useRef(document);
    const playerRef = useRef();

    function moveRight() {
        if (stage) {
            containerRef.current.position.x += 0.5;
        }
    }

    function moveLeft(moveBy: number) {}

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
        setPlayerPosition({
            x: playerX,
            y: playerY,
        });
    }

    useTick((delta) => {
        if (playerRef.current) {
            if (platformTiles) {
                // console.log(platformTiles, playerY, playerX);
                const isColliding = platformTiles.some((tile) => {
                    return tile.y <= playerY * 2 + 16 && tile.x <= playerX;
                });
                setIsColliding(isColliding);
            }
            if (!isColliding) {
                playerRef.current.position.y += 0.5;
                setPlayerY(playerY + 0.5);

                // if (stage) {
                //     stage.current.position.y += 0.5;
                // }
            }
            if (movementDirection === MovementDirection.Left) {
                playerRef.current.position.x -= 0.5;
                setPlayerX(playerX - 0.5);
            }
            if (movementDirection === MovementDirection.Right) {
                playerRef.current.position.x += 0.5;
                setPlayerX(playerX + 0.5);
            }
        }
    });

    // console.log(stage);

    useEffect(() => {
        loadIdleTextures();
        loadRunningTextures();
        // addPhysicsToHero();
    }, []);

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
            setMovementDirection(MovementDirection.Left);
            setIsRunning(true);
        } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
            // moveRight();
            setMovementDirection(MovementDirection.Right);
            setIsRunning(true);
        }
    }
    function handleKeyUp(e: KeyboardEvent) {
        setMovementDirection(MovementDirection.Idle);
        setIsRunning(false);
    }

    useEffect(() => {
        documentRef.current.addEventListener("keydown", handleKeyDown, true);

        return () => {
            documentRef.current.removeEventListener("keydown", handleKeyDown);
        };
    });

    useEffect(() => {
        documentRef.current.addEventListener("keyup", handleKeyUp, true);

        return () => {
            documentRef.current.removeEventListener("keyup", handleKeyUp);
        };
    });

    return (
        <Container x={playerX} y={playerY} ref={playerRef}>
            {idleTextures.length > 0 && !isRunning && (
                <AnimatedSprite
                    textures={idleTextures}
                    isPlaying={true}
                    animationSpeed={0.075}
                    loop={true}
                />
            )}
            {runTextures.length > 0 && isRunning && (
                <AnimatedSprite
                    textures={runTextures}
                    isPlaying={true}
                    animationSpeed={0.075}
                    loop={true}
                />
            )}
        </Container>
    );
}

export default Player;
