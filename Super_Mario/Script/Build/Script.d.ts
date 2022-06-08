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
    enum JOB {
        WALK = 0,
        FIGHT = 1,
        DIE = 2
    }
    class Enemy extends ƒAid.ComponentStateMachine<JOB> {
        static readonly iSubclass: number;
        private static instructions;
        constructor();
        static get(): ƒAid.StateMachineInstructions<JOB>;
        private static actDefault;
        private static actFight;
        private static actWalk;
        private static actDie;
        private static transitDefault;
        private hndEvent;
        private update;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class GameState extends ƒ.Mutable {
        timer: number;
        points: number;
        constructor(_timer: number);
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace Script {
    class Goomba extends ƒ.Node {
        rigidGoomba: ƒ.ComponentRigidbody;
        goombaStatemachine: ƒAid.ComponentStateMachine<JOB>;
        sprite: ƒAid.NodeSprite;
        constructor();
        spriteSetup(): Promise<void>;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Item extends ƒ.Node {
        lifespan: number;
        type: string;
        rigidItem: ƒ.ComponentRigidbody;
        xPos: number;
        constructor(_name: string, _type: string, xPos: number);
        spawn(): Promise<void>;
        changeLook(): void;
    }
}
declare namespace Script {
    import ƒAid = FudgeAid;
    let animations: ƒAid.SpriteSheetAnimations;
    let groundPositions: number[][];
}
declare namespace Script {
    import ƒAid = FudgeAid;
    function setupSprite(_name: string, _position: number[], _frames: number, _offset: number): Promise<ƒAid.NodeSprite>;
    function changeImage(): Promise<void>;
}
declare namespace Script {
    class Mario extends ƒ.Node {
        health: number;
        cntWalk: ƒ.Control;
        rigidMario: ƒ.ComponentRigidbody;
        sprite: ƒAid.NodeSprite;
        direction: string;
        jumpcooldown: number;
        constructor();
        spriteSetup(): Promise<void>;
        walk(): void;
        jump(): void;
        collectPowerUp(): void;
        playSounds(): void;
    }
}
declare namespace Script {
}
