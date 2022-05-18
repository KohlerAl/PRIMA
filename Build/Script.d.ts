declare module "Server" {
    export namespace L06_Household {
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
    import ƒ = FudgeCore;
    class DropToGroundInitial extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        graph: ƒ.Node;
        ground: ƒ.Node;
        cmpMeshGround: ƒ.ComponentMesh;
        meshTerrain: ƒ.MeshTerrain;
        constructor();
        addComponent: (_event: Event) => void;
        setHeight: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class GameState extends ƒ.Mutable {
        battery: number;
        exhaustion: number;
        constructor();
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let viewport: ƒ.Viewport;
    let rigidAvatar: ƒ.ComponentRigidbody;
    let treePositions: ƒ.Vector3[];
}
declare namespace Script {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    enum JOB {
        STALK = 0,
        STARE = 1
    }
    export class Slenderman extends ƒAid.ComponentStateMachine<JOB> {
        static readonly iSubclass: number;
        private static instructions;
        change: number;
        target: ƒ.Vector3;
        position: ƒ.Vector3;
        private cmpBody;
        constructor();
        static get(): ƒAid.StateMachineInstructions<JOB>;
        private static transitDefault;
        private static actDefault;
        private static actStalk;
        private static actStare;
        private hndEvent;
        private update;
    }
    export {};
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Stone extends ƒ.Node {
        stoneGraph: ƒ.Graph;
        ownGraph: ƒ.GraphInstance;
        position: ƒ.Vector3;
        size: ƒ.Vector3;
        constructor();
        createPosition(): void;
        scaleTree(): void;
        createRandom(_min: number, _max: number): number;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Tree extends ƒ.Node {
        treeGraph: ƒ.Graph;
        ownGraph: ƒ.GraphInstance;
        position: ƒ.Vector3;
        size: ƒ.Vector3;
        type: string;
        stem: ƒ.Node;
        rigidTree: ƒ.ComponentRigidbody;
        constructor(_type: string);
        createPosition(): void;
        scaleTree(): void;
        createRandom(_min: number, _max: number): number;
    }
}
