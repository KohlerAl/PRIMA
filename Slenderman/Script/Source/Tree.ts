namespace Script {
    import ƒ = FudgeCore;

    export class Tree extends ƒ.Node {
        treeGraph: ƒ.Graph;
        ownGraph: ƒ.GraphInstance;
        position: ƒ.Vector3;
        size: ƒ.Vector3;
        type: string;

        constructor(_type: string) {
            super("Tree");

            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;

            this.type = _type;
            this.treeGraph = <ƒ.Graph>ƒ.Project.resources[_type];
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

            /* if (this.checkPosition() == false) {
                console.log("false");  
            } */
            this.mtxLocal.translateX(this.position.x);
            this.mtxLocal.translateZ(this.position.z);
        }

        /* checkPosition(): boolean {
            for (let treePos of treePositions) {
                if (this.position.equals(treePos, 1)) {
                    return false;
                }
            }
            return true;
        } */

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