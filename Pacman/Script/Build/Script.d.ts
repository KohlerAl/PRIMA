declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let ghostyGang: Ghosty[];
    class Ghosty extends ƒ.Node {
        possibleDirections: string[];
        walkDirection: string;
        lastDirection: string;
        spritePosition: number[];
        speed: ƒ.Vector3;
        constructor(_positionX: number, _positionY: number, _spritePosition: number[]);
        checkPosition(): void;
        checkNextTile(): void;
        walk(): void;
        createSprite(): Promise<void>;
    }
    function ghostySetup(): Promise<void>;
}
declare namespace Script {
    import ƒ = FudgeCore;
    let graph: ƒ.Node;
    function checkTile(_x: number, _y: number): boolean;
}
