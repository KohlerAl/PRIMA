"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let avatar;
    let cmpCamera;
    //let speedRotY: number = -0.2;
    let speedRotX = 0.2;
    let rotationX = 0;
    let cntWalk = new ƒ.Control("cntWalk", 2, 0 /* PROPORTIONAL */);
    let exhaustion = 0;
    let canSprint = true;
    let gameState;
    let config;
    let numTrees = 15;
    Script.treePositions = [];
    let treeTypes = ["Graph|2022-04-26T14:47:00.339Z|52413", "Graph|2022-04-29T19:03:07.678Z|58333"];
    let numStones = 0;
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        Script.viewport = _event.detail;
        //get Avatar and Camera to walk and look around
        avatar = Script.viewport.getBranch().getChildrenByName("Avatar")[0];
        Script.rigidAvatar = avatar.getComponent(ƒ.ComponentRigidbody);
        Script.viewport.camera = cmpCamera = avatar.getChild(0).getComponent(ƒ.ComponentCamera);
        gameState = new Script.GameState();
        let response = await fetch("config.json");
        config = await response.json();
        console.log(config);
        let canvas = document.querySelector("canvas");
        canvas.requestPointerLock();
        canvas.addEventListener("pointermove", hndPointerMove);
        createTrees();
        createStones();
        animation();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        ƒ.Physics.simulate(); // if physics is included and used
        controlWalk();
        controlSpeed();
        Script.viewport.draw();
        gameState.battery -= 0.001;
        ƒ.AudioManager.default.update();
    }
    function controlWalk() {
        let input = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);
        cntWalk.setInput(input);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT]) && canSprint == true)
            cntWalk.setFactor(8);
        else
            cntWalk.setFactor(2);
        let strafe = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
        let vector = new ƒ.Vector3((1.5 * strafe * ƒ.Loop.timeFrameGame) / 10, 0, (cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 10));
        vector.transform(avatar.mtxLocal, false);
        Script.rigidAvatar.setVelocity(vector);
    }
    function hndPointerMove(_event) {
        //avatar.mtxLocal.rotateY(_event.movementX * speedRotY);
        /* let vector: ƒ.Vector3 = new ƒ.Vector3(0, _event.movementX * speedRotY, 0);
        vector.transform(avatar.mtxLocal, false);
        rigidAvatar.setRotation(vector);  */
        rotationX += _event.movementY * speedRotX;
        rotationX = Math.min(60, Math.max(-60, rotationX));
        cmpCamera.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
    }
    function controlSpeed() {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT]) && canSprint == true) {
            exhaustion += ƒ.Loop.timeFrameGame / 1000;
            gameState.exhaustion += ƒ.Loop.timeFrameGame / 1000;
            console.log(gameState.exhaustion);
            if (exhaustion > 4) {
                canSprint = false;
                setTimeout(function () {
                    canSprint = true;
                    exhaustion = 0;
                    gameState.exhaustion = 0;
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
    function createStones() {
        let parentStones = Script.viewport.getBranch().getChildrenByName("Environment")[0].getChildrenByName("Stones")[0];
        for (let i = 0; i < numStones; i++) {
            let stone = new Script.Stone();
            parentStones.addChild(stone);
        }
    }
    function animation() {
        let animseq = new ƒ.AnimationSequence();
        animseq.addKey(new ƒ.AnimationKey(0, 1));
        animseq.addKey(new ƒ.AnimationKey(750, 4));
        animseq.addKey(new ƒ.AnimationKey(1500, 1));
        let animStructure = {
            components: {
                ComponentTransform: [
                    {
                        "ƒ.ComponentTransform": {
                            mtxLocal: {
                                rotation: {
                                    x: animseq,
                                    y: animseq
                                }
                            }
                        }
                    }
                ]
            }
        };
        let animation = new ƒ.Animation("testAnimation", animStructure, 60);
        let cmpAnimator = new ƒ.ComponentAnimator(animation);
        cmpAnimator.scale = 1;
        let parentTrees = Script.viewport.getBranch().getChildrenByName("Environment")[0].getChildrenByName("Trees")[0];
        let tree = parentTrees.getChildrenByName("Tree")[0];
        if (tree.getComponent(ƒ.ComponentAnimator)) {
            tree.removeComponent(tree.getComponent(ƒ.ComponentAnimator));
        }
        tree.addComponent(cmpAnimator);
        cmpAnimator.activate(true);
        console.log("Component", cmpAnimator);
    }
})(Script || (Script = {}));
//# sourceMappingURL=Main.js.map