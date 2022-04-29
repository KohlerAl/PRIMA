namespace Script {
    import ƒ = FudgeCore;

    export class Tree extends ƒ.Node {
        treeGraph: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-04-26T14:47:00.339Z|52413"];

        ownGraph: ƒ.GraphInstance;
        position: ƒ.Vector3;
        size: ƒ.Vector3;

        constructor() {
            super("Tree");

            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;

            this.ownGraph = new ƒ.GraphInstance(this.treeGraph);
            this.ownGraph.reset();
            this.addChild(this.ownGraph);

            this.addComponent(new ƒ.ComponentTransform());
            this.addComponent(new DropToGroundInitial());

            this.createPosition();
            this.scaleTree();
        }

        createPosition(): void {
            let xPos: number = this.createRandom(-30, 30);
            let zPos: number = this.createRandom(-30, 30);

            this.position = new ƒ.Vector3(xPos, 0, zPos);
            /* if (treePositions.length > 0) {
                for (let treePos of treePositions) {
                    if (this.position.equals(treePos, 1)) {
                    }
                }
            } */
            this.mtxLocal.translateX(xPos);
            this.mtxLocal.translateZ(zPos);
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