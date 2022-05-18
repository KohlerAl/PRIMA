"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Stone extends ƒ.Node {
        stoneGraph = ƒ.Project.resources["Graph|2022-04-30T09:42:26.880Z|52399"];
        ownGraph;
        position;
        size;
        constructor() {
            super("Stone");
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.ownGraph = new ƒ.GraphInstance(this.stoneGraph);
            this.ownGraph.reset();
            this.addChild(this.ownGraph);
            this.addComponent(new ƒ.ComponentTransform());
            this.addComponent(new Script.DropToGroundInitial());
            this.createPosition();
            this.scaleTree();
        }
        createPosition() {
            this.position = new ƒ.Vector3(this.createRandom(-30, 30), 0, this.createRandom(-30, 30));
            this.mtxLocal.translateX(this.position.x);
            this.mtxLocal.translateZ(this.position.z);
        }
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
    Script.Stone = Stone;
})(Script || (Script = {}));
//# sourceMappingURL=Stone.js.map