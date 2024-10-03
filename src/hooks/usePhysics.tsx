import { useState } from "react";
import { TileBody } from "../types";
import { useTick } from "@pixi/react";

function usePhysics() {
    const [platformTiles, setPlatformTiles] = useState<TileBody[]>();
    const [playerPosition, setPlayerPosition] = useState<TileBody>();
    const [isColliding, setIsColliding] = useState<boolean>();

    useTick((delta) => {
        if (platformTiles && playerPosition) {
            const isColliding = platformTiles.some((tile) => {
                return tile.x <= playerPosition.x || tile.y <= playerPosition.y;
            });
            if (isColliding) {
                setIsColliding(true);
            }
        }
    });
    return {
        setPlatformTiles,
        setPlayerPosition,
        isColliding,
    };
}

export default usePhysics;
