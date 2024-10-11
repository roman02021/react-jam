import { CollisionTile, Position } from "../types";
import { MapTile } from "./loadMap";
import constants from "../constants.ts";

export function checkPlayerTerrainCollisions(
    playerPos: Position,
    tiles: CollisionTile[]
) {
    return tiles.filter((tile) => {
        if (
            playerPos.x < tile.x + tile.width &&
            playerPos.x + constants.CHAR_WIDTH > tile.x &&
            playerPos.y < tile.y + tile.height &&
            playerPos.y + constants.CHAR_HEIGHT > tile.y
        ) {
            return true;
        } else {
            return false;
        }
    });
}

export function getPlayerTerrainCollisionDirections(
    playerPos: Position,
    tiles: CollisionTile[]
) {
    const newCollisionDirections = {
        right: false,
        left: false,
        up: false,
        down: false,
    };

    // console.log(tiles);

    tiles.forEach((tile) => {
        //toto si zmenil z 48 na 47 a zrazu sa nespusta lava kolizia ked si na zemi
        const playerYBottom = Math.floor(playerPos.y) + constants.CHAR_HEIGHT;
        const tileBottom = tile.y + tile.height;
        const playerXRight = Math.floor(playerPos.x) + constants.CHAR_WIDTH;
        const tileRight = tile.x + tile.width;

        const botCollision = playerYBottom - tile.y;
        const topCollision = tileBottom - Math.floor(playerPos.y);
        const leftCollision = playerXRight - tile.x;
        const rightCollision = tileRight - Math.floor(playerPos.x);

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

export function checkPlayerTerrainCollisionsOld(
    playerPos: Position,
    tiles: MapTile[]
) {
    const newCollisionDirections = {
        right: false,
        left: false,
        up: false,
        down: false,
    };

    // console.log(tiles);

    tiles.forEach((tile) => {
        //toto si zmenil z 48 na 47 a zrazu sa nespusta lava kolizia ked si na zemi
        const playerYBottom = Math.floor(playerPos.y) + constants.CHAR_HEIGHT;
        const tileBottom = tile.y + 16;
        const playerXRight = Math.floor(playerPos.x) + constants.CHAR_WIDTH;
        const tileRight = tile.x + 16;

        const botCollision = playerYBottom - tile.y;
        const topCollision = tileBottom - Math.floor(playerPos.y);
        const leftCollision = playerXRight - tile.x;
        const rightCollision = tileRight - Math.floor(playerPos.x);

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
