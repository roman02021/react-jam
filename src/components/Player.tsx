import React, { useCallback, useRef, useState } from "react";
import {
    Stage,
    Container,
    useTick,
    AnimatedSprite,
    _ReactPixi,
    Graphics,
    useApp,
} from "@pixi/react";
import { Texture, Spritesheet } from "pixi.js";
import { useEffect } from "react";
import CharSpriteSheet from "../assets/char/spirtesheet.json";
import CharRunSpriteSheet from "../assets/run/spirtesheet.json";
import { loadTexture } from "../system/loadTexture";
import PlayerAnimations from "../assets/char/player-animations.json";
import constants from "../constants.ts";
import { PlayerAnimationsType } from "../types.ts";

import {
    checkPlayerTerrainCollisions,
    getPlayerTerrainCollisionDirections,
} from "../system/checkCollisions";
import { CollisionTile } from "../types.ts";
interface Props {
    stage: Stage;
    engine: object;
    setCamera: () => void;
    cameraPosition: Position;
}
enum MovementDirection {
    Idle = "idle",
    Left = "left",
    Right = "right",
    Up = "up",
    Down = "down",
    Jump = "jump",
}

function RectangleFunc(props) {
    const draw = useCallback(
        (g) => {
            g.clear();
            g.beginFill(props.color);
            g.drawRect(props.x, props.y, props.width, props.height);
            g.endFill();
        },
        [props]
    );

    return <Graphics draw={draw} />;
}

interface MovementDirectionObj {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
}

interface Collision {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
}

interface Position {
    x: number;
    y: number;
}

function Player({
    setPlayerPosition,
    isColliding,
    stage,
    engine,
    platformTiles,
    setIsColliding,
    setCameraPosition,
    cameraPosition,
}: Props) {
    const [idleTextures, setIdleTextures] = useState<Texture[]>([]);
    const [runTextures, setRunTextures] = useState<Texture[]>([]);

    const [playerX, setPlayerX] = useState<number>(constants.CHAR_WIDTH / 2);
    const [playerY, setPlayerY] = useState<number>(constants.CHAR_HEIGHT / 2);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [currentAnimation, setCurrentAnimation] = useState<Texture[]>();
    const [playerAnimations, setPlayerAnimations] =
        useState<PlayerAnimationsType>();
    const [movementDirection, setMovementDirection] =
        useState<MovementDirectionObj>({
            left: false,
            right: false,
            up: false,
            down: false,
        });
    const [collisionDirection, setCollisionDirection] = useState<Collision>({
        left: false,
        right: false,
        up: false,
        down: false,
    });
    const [isJumping, setIsJumping] = useState<boolean>(false);
    const [jumpHeight, setJumpHeight] = useState<number>(0);
    const [isFalling, setIsFalling] = useState<boolean>(false);
    const containerRef = useRef<_ReactPixi.IContainer | null>();
    const [seconds, setSeconds] = useState<number>(0);
    const [goingLeft, setGoingLeft] = useState<boolean>(false);
    const [goingRight, setGoingRight] = useState<boolean>(false);
    const [timeJumping, setTimeJumping] = useState(0);
    const [jumpStartLocationY, setJumpStartLocationY] = useState<number>(0);
    const [colTiles, setColTiles] = useState<CollisionTile[]>([]);
    const [doubleJumped, setDoubleJumped] = useState<boolean>(false);
    const [hitbox, setHitbox] = useState({
        x: 0,
        y: 0,
        width: 25,
        height: 40,
    });
    const [velocity, setVelocity] = useState({
        x: 0,
        y: 0,
    });

    const app = useApp();

    const documentRef = useRef(document);
    const playerRef = useRef();

    useTick((delta) => {
        let collisionDirection = {
            right: false,
            left: false,
            up: false,
            down: false,
        };
        if (platformTiles) {
            const collidingTiles = checkPlayerTerrainCollisions(
                {
                    x: playerX,
                    y: playerY,
                },
                platformTiles
            );

            setColTiles(collidingTiles);

            if (collidingTiles.length > 0) {
                collisionDirection = getPlayerTerrainCollisionDirections(
                    { x: playerX, y: playerY },
                    collidingTiles
                );
            }
        }
        const horVel = {
            ...velocity,
        };

        if (goingRight && !collisionDirection.left) {
            horVel.x += 2;
        }

        if (goingLeft && !collisionDirection.right) {
            horVel.x -= 2;
        }

        if (!isJumping && !collisionDirection.down) {
            horVel.y += 2;
        }
        if (collisionDirection.down) {
            setDoubleJumped(false);
            if (isFalling) {
                setIsFalling(false);
            }
        }
        if (isJumping && !collisionDirection.up) {
            horVel.y -= 4;
            setJumpHeight(jumpHeight + 4);
        }
        if (jumpHeight > constants.JUMP_HEIGHT) {
            setJumpHeight(0);
            setIsJumping(false);
            setIsFalling(true);
        }

        setPlayerX(playerX + horVel.x * delta);
        setPlayerY(playerY + horVel.y * delta);

        setCollisionDirection(collisionDirection);
    });

    useEffect(() => {
        setCameraPosition({
            x: app.stage.width / 2 - playerX,
            y: app.stage.height / 2 - playerY,
        });
    }, [playerX, playerY]);

    // console.log(currentAnimation);

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (
                (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") &&
                !e.repeat
            ) {
                setGoingLeft(true);
            } else if (
                (e.key === "ArrowRight" || e.key === "d" || e.key === "D") &&
                !e.repeat
            ) {
                setGoingRight(true);
            } else if (e.key === "Space" || e.key === "w" || e.key === "W") {
                if (collisionDirection.down) {
                    setIsJumping(true);
                    setJumpHeight(0);
                    setJumpTime(0);
                } else if ((isJumping || isFalling) && !doubleJumped) {
                    setDoubleJumped(true);
                    setIsJumping(true);
                    setJumpHeight(0);
                }
            }
        }
        documentRef.current.addEventListener("keydown", handleKeyDown);

        function handleKeyUp(e: KeyboardEvent) {
            console.log(e);
            if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
                setGoingLeft(false);
            } else if (
                e.key === "ArrowRight" ||
                e.key === "d" ||
                e.key === "D"
            ) {
                setGoingRight(false);
            }
        }
        documentRef.current.addEventListener("keyup", handleKeyUp);

        return () => {
            documentRef.current.removeEventListener("keydown", handleKeyDown);
            documentRef.current.removeEventListener("keyup", handleKeyUp);
        };
    }, [collisionDirection]);
    useEffect(() => {
        const playerAnimationsLoaded = loadTexture(PlayerAnimations);
        setPlayerAnimations(playerAnimationsLoaded);
        console.log(playerAnimations);
        setCurrentAnimation(playerAnimationsLoaded.idle);
    }, []);

    console.log(currentAnimation);

    return (
        <>
            <Container x={playerX} y={playerY} ref={playerRef}>
                {idleTextures.length > 0 && !isRunning && (
                    <AnimatedSprite
                        textures={currentAnimation}
                        isPlaying={true}
                        animationSpeed={0.075}
                        loop={true}
                        anchor={{ x: 0.25, y: 0 }}
                    />
                )}
                {runTextures.length > 0 && isRunning && (
                    <AnimatedSprite
                        textures={currentAnimation}
                        isPlaying={true}
                        animationSpeed={0.075}
                        loop={true}
                    />
                )}
            </Container>
            {/* <RectangleFunc
                x={playerX}
                y={playerY}
                width={25}
                height={48}
                color={0x0000ff}
            /> */}

            {isColliding && (
                <RectangleFunc
                    x={playerX}
                    y={playerY}
                    width={25}
                    height={48}
                    color={0xa020f0}
                />
            )}
            {colTiles &&
                colTiles.map((tile, index) => (
                    <RectangleFunc
                        key={index}
                        x={tile.x}
                        y={tile.y}
                        width={tile.width}
                        height={tile.height}
                        color={0x00ff00}
                    />
                ))}
        </>
    );
}

export default Player;
