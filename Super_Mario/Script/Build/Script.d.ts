declare namespace Script {
    function setUpCam(): void;
    function moveCam(_vector: ƒ.Vector3): void;
}
declare namespace Script {
    class Coin extends ƒ.Node {
        positionX: number;
        positionY: number;
        lifespan: number;
        parentItem: Item;
        coinSound: ƒ.ComponentAudio;
        coinPoints: number;
        constructor(_x: number, _y: number);
        spawn(): Promise<void>;
        animateCoin(): void;
        countdown(): void;
    }
}
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
        direction: string;
        groundPart: number;
        material: ƒ.ComponentMaterial;
        constructor();
        update(): void;
        flipSprite(): void;
        private spriteSetup;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Item extends ƒ.Node {
        type: string;
        rigidItem: ƒ.ComponentRigidbody;
        xPos: number;
        material: ƒ.Material;
        coin: Coin;
        looted: boolean;
        constructor(_name: string, _type: string);
        spawn(): Promise<void>;
        manageHit(): void;
        getCoin(): void;
        changeLook(): Promise<void>;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let viewport: ƒ.Viewport;
    let graph: ƒ.Node;
    let mario: Mario;
    let camNode: ƒ.Node;
    let goombas: Goomba[];
    let goombaParent: ƒ.Node;
    let gameState: GameState;
    let numberPointsGoomba: number;
    let deathSound: ƒ.ComponentAudio;
    let winSound: ƒ.ComponentAudio;
    let timer: ƒ.Timer;
    let tileNumbers: number[];
    function update(_event: Event): void;
    function createRandomNumber(_min: number, _max: number): number;
    function createRandomDirection(): string;
    function isBetween(_x: number, _min: number, _max: number): boolean;
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
        jumpSound: ƒ.ComponentAudio;
        constructor();
        update(): void;
        private walk;
        private jump;
        private checkDeath;
        private spriteSetup;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class SetPosition extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        createPosition(): void;
    }
}
declare namespace Script {
    let canvas: HTMLCanvasElement;
}
