import React, { useRef, useState } from "react";
import {
    Stage,
    Container,
    useTick,
    AnimatedSprite,
    _ReactPixi,
    useApp,
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
    Jump = "jump",
}

interface MovementDirectionObj {
    Idle: boolean;
    Left: boolean;
    Right: boolean;
    Up: boolean;
    Down: boolean;
}

interface Collision {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
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
        useState<MovementDirectionObj>({
            Idle: true,
            Left: false,
            Right: false,
            Up: false,
            Down: false,
            Jump: false,
        });
    const [collisionDirection, setCollisionDirection] = useState<Collision>({
        left: false,
        right: false,
        up: false,
        down: false,
    });
    const [isJumping, setIsJumping] = useState<boolean>(false);
    const [jumpHeight, setJumpHeight] = useState<number>(0);
    const containerRef = useRef<_ReactPixi.IContainer | null>();

    const app = useApp();

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
    let seconds = 0;
    useTick((delta, abc) => {
        seconds += 1 / 60;

        if (playerRef.current) {
            if (platformTiles) {
                const isColliding = platformTiles.some((tile) => {
                    // return tile.y <= playerY - 32 && tile.x <= playerX;

                    if (
                        playerRef.current.position.x <= tile.x + 16 &&
                        playerRef.current.position.x + 35 >= tile.x &&
                        playerRef.current.position.y <= tile.y &&
                        playerRef.current.position.y + 48 >= tile.y
                    ) {
                        // Collision detected!
                        // console.log(
                        //     "Collision detected!",
                        //     `player: x: ${playerRef.current.position.x}, y: ${playerRef.current.position.y}`,
                        //     `tile: x: ${tile.x}, y: ${tile.y}`
                        // );

                        const player_bottom = playerRef.current.position.y + 48;
                        const tiles_bottom = tile.y + 16;
                        const player_right = playerRef.current.position.x + 35;
                        const tiles_right = tile.x + 16;

                        const b_collision =
                            tiles_bottom - playerRef.current.position.y;
                        const t_collision = player_bottom - tile.y;
                        const l_collision = player_right - tile.x;
                        const r_collision =
                            tiles_right - playerRef.current.position.x;

                        const newCollisionDirections = {
                            ...collisionDirection,
                        };

                        if (
                            t_collision < b_collision &&
                            t_collision < l_collision &&
                            t_collision < r_collision
                        ) {
                            newCollisionDirections.down = true;
                        } else {
                            // setCollisionDirection();
                            newCollisionDirections.down = false;
                        }

                        if (
                            b_collision < t_collision &&
                            b_collision < l_collision &&
                            b_collision < r_collision
                        ) {
                            newCollisionDirections.up = true;
                        } else {
                            // setCollisionDirection();
                            newCollisionDirections.up = false;
                        }
                        if (
                            l_collision < r_collision &&
                            l_collision < t_collision &&
                            l_collision < b_collision
                        ) {
                            newCollisionDirections.right = true;
                        } else {
                            // setCollisionDirection();
                            newCollisionDirections.right = false;
                        }
                        if (
                            r_collision < l_collision &&
                            r_collision < t_collision &&
                            r_collision < b_collision
                        ) {
                            newCollisionDirections.left = true;
                        } else {
                            // setCollisionDirection();
                            newCollisionDirections.left = false;
                        }

                        setCollisionDirection(newCollisionDirections);

                        return true;
                    } else {
                        // No collision
                        return false;
                    }
                });

                //TODO: pories preco tam mas - 32
                setIsColliding(isColliding);
            }
            if (!isColliding && !isJumping) {
                playerRef.current.position.y += 0.5;
                setPlayerY(playerY + 0.5);
                if (stage) {
                    stage.y -= 0.5;
                }
            }
            if (movementDirection.Left) {
                if (collisionDirection.left === false) {
                    playerRef.current.position.x -= 0.5;
                    setPlayerX(playerX - 0.5);
                    stage.x += 0.5;
                }
            }
            if (movementDirection.Right) {
                console.log("COCK");
                if (collisionDirection.right === false) {
                    playerRef.current.position.x += 0.5;
                    setPlayerX(playerX + 0.5);
                    stage.x -= 0.5;
                }
            }
            if (isJumping) {
                // console.log(movementDirection);
                if (collisionDirection.up === false) {
                    setJumpHeight(jumpHeight + 0.5);
                    playerRef.current.position.y -= 0.5;
                    setPlayerY(playerY - 0.5);
                    stage.y += 0.5;

                    if (jumpHeight >= 30) {
                        console.log("STOPPED JUMPING");

                        setIsJumping(false);
                        setJumpHeight(0);
                    }
                }
            }
        }

        if (seconds > 1) {
            seconds = 0;
        }
    });

    useEffect(() => {
        loadIdleTextures();
        loadRunningTextures();

        // addPhysicsToHero();
    }, []);

    useEffect(() => {
        if (stage) {
            stage.x = app.view.width / 2;
            stage.y = app.view.height / 2;
            stage.pivot.x = 200;
            stage.pivot.y = 100;
        }
    }, [stage]);

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
            setMovementDirection({
                ...movementDirection,
                Left: true,
            });
            setIsRunning(true);
        } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
            setMovementDirection({
                ...movementDirection,
                Right: true,
            });
            setIsRunning(true);
        } else if (e.key === "Space" || e.key === "w" || e.key === "W") {
            setIsJumping(true);
        }
    }
    function handleKeyUp(e: KeyboardEvent) {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
            setMovementDirection({
                ...movementDirection,
                Left: false,
            });
        } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
            setMovementDirection({
                ...movementDirection,
                Right: false,
            });
        }

        setIsRunning(false);
    }

    useEffect(() => {
        documentRef.current.addEventListener("keydown", handleKeyDown, true);

        return () => {
            documentRef.current.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        documentRef.current.addEventListener("keyup", handleKeyUp, true);

        return () => {
            documentRef.current.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

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
