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
    import ƒAid = FudgeAid;
    let animations: ƒAid.SpriteSheetAnimations;
}
declare namespace Script {
    import ƒAid = FudgeAid;
    function setupSprite(_name: string, _position: number[], _frames: number): Promise<ƒAid.NodeSprite>;
    function changeImage(): Promise<void>;
}
declare namespace Script {
    class Mario extends ƒ.Node {
        health: number;
        cntWalk: ƒ.Control;
        rigidMario: ƒ.ComponentRigidbody;
        jumpcooldown: number;
        constructor();
        spriteSetup(): Promise<void>;
        walk(): void;
        jump(): void;
        collectPowerUp(): void;
        playSounds(): void;
    }
}
