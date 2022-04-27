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
            document.addEventListener("interactiveViewportStarted", this.setHeight);
        }
        setHeight = (_event) => {
            //find the terrain mesh 
            this.graph = Script.viewport.getBranch();
            this.ground = this.graph.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0];
            this.cmpMeshGround = this.ground.getComponent(ƒ.ComponentMesh);
            this.meshTerrain = this.cmpMeshGround.mesh;
            this.node.mtxLocal.translateY(5);
            let distance = this.meshTerrain.getTerrainInfo(this.node.mtxLocal.translation, this.cmpMeshGround.mtxWorld).distance;
            if (Math.sign(distance) == 1)
                this.node.mtxLocal.translateY(-distance);
            else if (Math.sign(distance) == -1 || Math.sign(distance) == 0)
                this.node.mtxLocal.translateY(distance);
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
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        Script.viewport = _event.detail;
        //get Avatar and Camera to walk and look around
        avatar = Script.viewport.getBranch().getChildrenByName("Avatar")[0];
        Script.viewport.camera = cmpCamera = avatar.getChild(0).getComponent(ƒ.ComponentCamera);
        Script.viewport.getCanvas().addEventListener("pointermove", hndPointerMove);
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
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map