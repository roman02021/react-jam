import { useState } from "react";
import { TileBody } from "../types";
import { useTick } from "@pixi/react";

interface PressedKeys {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
    space: boolean;
    shift: boolean;
}

function useKeyboard() {
    const [pressedKeys, setPressedKeys] = useState<PressedKeys>();
}

export default useKeyboard;
