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
    let viewport: ƒ.Viewport;
    let treePositions: ƒ.Vector3[];
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Slenderman extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        change: number;
        target: ƒ.Vector3;
        position: ƒ.Vector3;
        constructor();
        hndEvent: (_event: Event) => void;
        walkSlendi: (_event: Event) => void;
    }
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
        constructor(_type: string);
        createPosition(): void;
        scaleTree(): void;
        createRandom(_min: number, _max: number): number;
    }
}
