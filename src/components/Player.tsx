import React, { useRef, useState } from "react";
import { Stage, Container, useTick, AnimatedSprite } from "@pixi/react";
import { Texture, Spritesheet, Assets } from "pixi.js";
import { useEffect } from "react";
import CharSpriteSheet from "../assets/char/spirtesheet.json";
import CharRunSpriteSheet from "../assets/run/spirtesheet.json";

function Player() {
    const [idleTextures, setIdleTextures] = useState<Texture[]>([]);
    const [runTextures, setRunTextures] = useState<Texture[]>([]);

    const [playerX, setPlayerX] = useState<number>(10);
    const [playerY, setPlayerY] = useState<number>(170);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const documentRef = useRef(document);

    function moveRight() {
        console.log("moveRight", playerX);
        setPlayerX((playerX) => playerX + 10);
    }

    function moveLeft(moveBy: number) {
        console.log("moveLeft", playerX);
        setPlayerX((playerX) => playerX - moveBy);
    }

    async function loadIdleTextures() {
        console.log(CharSpriteSheet);
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
        console.log(ss.animations["Run-Sheet"]);
        setRunTextures(ss.animations["Run-Sheet"]);
    }

    useEffect(() => {
        loadIdleTextures();
        loadRunningTextures();
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
    }, []);
    return (
        <Container x={playerX} y={playerY}>
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
