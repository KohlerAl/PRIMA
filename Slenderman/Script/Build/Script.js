"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class DropToGroundInitial extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(DropToGroundInitial);
        // Properties may be mutated by users in the editor via the automatically created user interface
        graph;
        ground;
        cmpMeshGround;
        meshTerrain;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            //render-event und dann beim ersten aufruf der funktion den listener löschen 
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.addComponent);
        }
        addComponent = (_event) => {
            this.node.addEventListener("renderPrepare" /* RENDER_PREPARE */, this.setHeight);
        };
        setHeight = (_event) => {
            this.graph = ƒ.Project.resources["Graph|2022-04-14T13:06:10.990Z|08163"];
            this.ground = this.graph.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0];
            this.cmpMeshGround = this.ground.getComponent(ƒ.ComponentMesh);
            this.meshTerrain = this.cmpMeshGround.mesh;
            if (this.meshTerrain) {
                let distance = this.meshTerrain.getTerrainInfo(this.node.mtxLocal.translation, this.cmpMeshGround.mtxWorld).distance;
                if (distance)
                    this.node.mtxLocal.translateY(-distance);
            }
            //this.node.removeEventListener(ƒ.EVENT.RENDER_PREPARE, this.setHeight);
        };
    }
    Script.DropToGroundInitial = DropToGroundInitial;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let avatar;
    let cmpCamera;
    let speedRotY = -0.2;
    let speedRotX = 0.2;
    let rotationX = 0;
    let cntWalk = new ƒ.Control("cntWalk", 2, 0 /* PROPORTIONAL */, 500);
    let exhaustion = 0;
    let canSprint = true;
    let numTrees = 150;
    Script.treePositions = [];
    let treeTypes = ["Graph|2022-04-26T14:47:00.339Z|52413", "Graph|2022-04-29T19:03:07.678Z|58333"];
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        Script.viewport = _event.detail;
        //get Avatar and Camera to walk and look around
        avatar = Script.viewport.getBranch().getChildrenByName("Avatar")[0];
        Script.viewport.camera = cmpCamera = avatar.getChild(0).getComponent(ƒ.ComponentCamera);
        let canvas = document.querySelector("canvas");
        canvas.requestPointerLock();
        canvas.addEventListener("pointermove", hndPointerMove);
        createTrees();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        controlWalk();
        controlSpeed();
        Script.viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function controlWalk() {
        let input = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        cntWalk.setInput(input);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT]) && canSprint == true)
            cntWalk.setFactor(8);
        else
            cntWalk.setFactor(2);
        avatar.mtxLocal.translateZ(cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000);
        let strafe = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
        avatar.mtxLocal.translateX((1.5 * strafe * ƒ.Loop.timeFrameGame) / 1000);
        /* cntWalk.setInput(strafe);
        avatar.mtxLocal.translateX(cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 1000); */
    }
    function hndPointerMove(_event) {
        avatar.mtxLocal.rotateY(_event.movementX * speedRotY);
        rotationX += _event.movementY * speedRotX;
        rotationX = Math.min(60, Math.max(-60, rotationX));
        cmpCamera.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
    }
    function controlSpeed() {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT]) && canSprint == true) {
            exhaustion += ƒ.Loop.timeFrameGame / 1000;
            if (exhaustion > 4) {
                canSprint = false;
                setTimeout(function () {
                    canSprint = true;
                    exhaustion = 0;
                }, 7000);
            }
        }
    }
    function createTrees() {
        let parentTrees = Script.viewport.getBranch().getChildrenByName("Environment")[0].getChildrenByName("Trees")[0];
        for (let i = 0; i < numTrees; i++) {
            let type = treeTypes[Math.floor(Math.random() * treeTypes.length)];
            let tree = new Script.Tree(type);
            Script.treePositions.push(tree.position);
            parentTrees.addChild(tree);
        }
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);
    class Slenderman extends ƒ.ComponentScript {
        static iSubclass = ƒ.Component.registerSubclass(Slenderman);
        change = 0;
        target = new ƒ.Vector3();
        position = new ƒ.Vector3(0, 0, 0);
        constructor() {
            super();
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            //
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
        }
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    this.node.addEventListener("renderPrepare" /* RENDER_PREPARE */, this.walkSlendi);
                    //this.node.mtxLocal.translate(this.position);
                    break;
            }
        };
        walkSlendi = (_event) => {
            this.position.add(ƒ.Vector3.SCALE(this.target, ƒ.Loop.timeFrameGame / 1000));
            if (this.position.x > -30 && this.position.x < 30 && this.position.y > -30 && this.position.y < 30)
                this.node.mtxLocal.translate(ƒ.Vector3.SCALE(this.target, ƒ.Loop.timeFrameGame / 1000));
            if (this.change > ƒ.Time.game.get())
                return;
            this.change = ƒ.Time.game.get() + 1000;
            this.target = ƒ.Random.default.getVector3(new ƒ.Vector3(-1, 0, -1), new ƒ.Vector3(1, 0, 1));
        };
    }
    Script.Slenderman = Slenderman;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Tree extends ƒ.Node {
        treeGraph;
        ownGraph;
        position;
        size;
        type;
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
//# sourceMappingURL=Script.js.map