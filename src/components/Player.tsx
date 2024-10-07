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

const X_VELOCITY = 200;
const JUMP_POWER = 250;
const GRAVITY = 580;
const JUMP_HEIGHT = 100;

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

    const [playerX, setPlayerX] = useState<number>(10 - 25 / 2);
    const [playerY, setPlayerY] = useState<number>(-100 + 48 / 2);
    const [isRunning, setIsRunning] = useState<boolean>(false);
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
    const [colTiles, setColTiles] = useState([]);
    const [doubleJumped, setDoubleJumped] = useState<boolean>(false);
    const [hitbox, setHitbox] = useState({
        x: 0,
        y: 0,
        width: 25,
        height: 40,
    });
    const [keyPressed, setKeyPressed] = useState<boolean>(false);
    const [velocity, setVelocity] = useState({
        x: 0,
        y: 0,
    });
    const [keysPressed, setKeysPressed] = useState<string[]>([]);

    const app = useApp();

    // const [isColliding, setIsColliding] = useState(false);

    const documentRef = useRef(document);
    const playerRef = useRef();

    async function loadIdleTextures() {
        const ss = new Spritesheet(
            Texture.from(CharSpriteSheet.meta.image),
            CharSpriteSheet
        );

        await ss.parse();

        setIdleTextures(ss.animations["Idle-Sheet"]);
    }

    function handleHorizontalMovememnt() {
        // console.log(movementDirection);
        // if (movementDirection.left && !movementDirection.right) {
        //     setVelocity({
        //         ...velocity,
        //         x: -2,
        //     });
        // } else if (movementDirection.right && !movementDirection.left) {
        //     setVelocity({
        //         ...velocity,
        //         x: 2,
        //     });
        // } else {
        //     setVelocity({
        //         ...velocity,
        //         x: 0,
        //     });
        // }
    }

    async function loadRunningTextures() {
        const ss = new Spritesheet(
            Texture.from(CharRunSpriteSheet.meta.image),
            CharRunSpriteSheet
        );

        await ss.parse();
        setRunTextures(ss.animations["Run-Sheet"]);
    }

    function getCollidingTiles(player, tiles) {
        return tiles.filter((tile) => {
            if (
                player.x < tile.x + 16 &&
                player.x + 25 > tile.x &&
                player.y < tile.y &&
                player.y + 48 > tile.y
            ) {
                return true;
            } else {
                return false;
            }
        });
    }

    function jump() {}

    function getCollisionDirections(player, tiles) {
        const newCollisionDirections = {
            right: false,
            left: false,
            up: false,
            down: false,
        };

        // console.log(tiles);

        tiles.forEach((tile) => {
            //toto si zmenil z 48 na 47 a zrazu sa nespusta lava kolizia ked si na zemi
            const playerYBottom = Math.floor(player.y) + 48;
            const tileBottom = tile.y + 16;
            const playerXRight = Math.floor(player.x) + 25;
            const tileRight = tile.x + 16;

            const botCollision = playerYBottom - tile.y;
            const topCollision = tileBottom - Math.floor(player.y);
            const leftCollision = playerXRight - tile.x;
            const rightCollision = tileRight - Math.floor(player.x);

            if (
                rightCollision < leftCollision &&
                rightCollision < botCollision &&
                rightCollision < topCollision &&
                newCollisionDirections.right === false
            ) {
                newCollisionDirections.right = true;
            } else if (
                leftCollision < rightCollision &&
                leftCollision < botCollision &&
                leftCollision < topCollision &&
                newCollisionDirections.left === false
            ) {
                newCollisionDirections.left = true;
            } else if (
                botCollision + 1 < topCollision &&
                botCollision + 1 < leftCollision &&
                botCollision + 1 < rightCollision &&
                newCollisionDirections.down === false
            ) {
                // dal si +1 lebo postava sa prilepila z lavej strany na platformu ked padala
                // console.log(
                //     tile,
                //     playerX,
                //     playerY,
                //     "leftCol: ",
                //     leftCollision,
                //     "rightCol: ",
                //     rightCollision,
                //     "botCol: ",
                //     botCollision,
                //     "Col: ",
                //     topCollision
                // );
                newCollisionDirections.down = true;
            } else if (
                topCollision < botCollision &&
                topCollision < leftCollision &&
                topCollision < rightCollision &&
                newCollisionDirections.up === false
            ) {
                newCollisionDirections.up = true;
            }
        });

        return newCollisionDirections;
    }

    useTick((delta) => {
        let collisionDirection = {
            right: false,
            left: false,
            up: false,
            down: false,
        };
        if (platformTiles) {
            const collidingTiles = getCollidingTiles(
                {
                    x: playerX,
                    y: playerY,
                },
                platformTiles
            );

            setColTiles(collidingTiles);

            if (collidingTiles.length > 0) {
                collisionDirection = getCollisionDirections(
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
            horVel.y -= 2;
            setJumpHeight(jumpHeight + 2);
        }
        if (jumpHeight > JUMP_HEIGHT) {
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

    useEffect(() => {
        loadIdleTextures();
        loadRunningTextures();
    }, []);

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

    return (
        <>
            <Container x={playerX} y={playerY} ref={playerRef}>
                {idleTextures.length > 0 && !isRunning && (
                    <AnimatedSprite
                        textures={idleTextures}
                        isPlaying={true}
                        animationSpeed={0.075}
                        loop={true}
                        height={48}
                    />
                )}
                {runTextures.length > 0 && isRunning && (
                    <AnimatedSprite
                        textures={runTextures}
                        isPlaying={true}
                        animationSpeed={0.075}
                        loop={true}
                        height={48}
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
                        width={16}
                        height={16}
                        color={0x00ff00}
                    />
                ))}
        </>
    );
}

export default Player;
