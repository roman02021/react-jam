import { BaseTexture, Rectangle, Texture } from "pixi.js";
import { AnimationTiles, PlayerAnimations } from "../types";

export function loadTexture(animationTiles: AnimationTiles) {
    // const ss = new Spritesheet(
    //     Texture.from(CharSpriteSheet.meta.image),
    //     CharSpriteSheet
    // );

    const playerAnimations: PlayerAnimations = {
        idle: [],
        running: [],
        jump: [],
        attack1: [],
        attack2: [],
    };

    try {
        // const baseTexture = BaseTexture.from(animationSpritesheet.image);
        // console.log(baseTexture);

        animationTiles.tiles.forEach((tile) => {
            if (tile.properties[0].value === "idle") {
                playerAnimations.idle.push(Texture.from(tile.image));
            } else if (tile.properties[0].value === "running") {
                playerAnimations.running.push(Texture.from(tile.image));
            } else if (tile.properties[0].value === "jump") {
                playerAnimations.jump.push(Texture.from(tile.image));
            }
        });
    } catch (e) {
        console.log(e);
    }

    return playerAnimations;

    // await ss.parse();

    // console.log(ss);

    console.log(animationSpritesheet);

    // setIdleTextures(ss.animations["Idle-Sheet"]);
}
