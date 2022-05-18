"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Tree extends ƒ.Node {
        treeGraph;
        ownGraph;
        position;
        size;
        type;
        stem;
        rigidTree;
        constructor(_type) {
            super("Tree");
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.type = _type;
            this.treeGraph = ƒ.Project.resources[_type];
            this.ownGraph = new ƒ.GraphInstance(this.treeGraph);
            this.ownGraph.reset();
            this.addChild(this.ownGraph);
            this.addComponent(new ƒ.ComponentTransform());
            this.addComponent(new Script.DropToGroundInitial());
            //this.rigidTree.initialization = ƒ.BODY_INIT.TO_NODE; 
            //this.rigidTree.typeCollider = ƒ.COLLIDER_TYPE.CYLINDER; 
            this.createPosition();
            this.scaleTree();
        }
        createPosition() {
            let xPos = this.createRandom(-30, 30);
            let zPos = this.createRandom(-30, 30);
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
        scaleTree() {
            let scaleY = this.createRandom(0.5, 1.5);
            this.size = new ƒ.Vector3(1, scaleY, 1);
            this.mtxLocal.scale(this.size);
        }
        createRandom(_min, _max) {
            let randomNumber = Math.random() * (_max - _min) + _min;
            return randomNumber;
        }
    }
    Script.Tree = Tree;
})(Script || (Script = {}));
//# sourceMappingURL=Tree.js.map