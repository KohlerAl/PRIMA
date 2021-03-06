namespace Script {
    import ƒ = FudgeCore;

    export class Stone extends ƒ.Node {
        stoneGraph: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-04-30T09:42:26.880Z|52399"];
        ownGraph: ƒ.GraphInstance;
        position: ƒ.Vector3;
        size: ƒ.Vector3;

        constructor() {
            super("Stone");

            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;

            this.ownGraph = new ƒ.GraphInstance(this.stoneGraph);
            this.ownGraph.reset();
            this.addChild(this.ownGraph);

            this.addComponent(new ƒ.ComponentTransform());
            this.addComponent(new DropToGroundInitial());

            this.createPosition();
            this.scaleTree();
        }

        createPosition(): void {
            this.position = new ƒ.Vector3(this.createRandom(-30, 30), 0, this.createRandom(-30, 30));

            this.mtxLocal.translateX(this.position.x);
            this.mtxLocal.translateZ(this.position.z);
        }

        scaleTree(): void {
            let scaleY: number = this.createRandom(0.5, 1.5);
            this.size = new ƒ.Vector3(1, scaleY, 1);
            this.mtxLocal.scale(this.size);
        }

        createRandom(_min: number, _max: number): number {
            let randomNumber: number = Math.random() * (_max - _min) + _min;
            return randomNumber;
        }
    }
}