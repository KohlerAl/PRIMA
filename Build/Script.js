"use strict";
System.register("Server", ["http"], function (exports_1, context_1) {
    "use strict";
    var Http, L06_Household;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (Http_1) {
                Http = Http_1;
            }
        ],
        execute: function () {
            (function (L06_Household) {
                let server = Http.createServer();
                let port = process.env.PORT;
                if (port == undefined)
                    port = 5001;
                console.log("Server starting on port:" + port);
                server.listen(port);
                server.addListener("request", handleRequest);
                function handleRequest(_request, _response) {
                    console.log("What's up?");
                    /* _response.setHeader("content-type", "text/html; charset=utf-8");
                    _response.setHeader("Access-Control-Allow-Origin", "*");
            
                    if (_request.url) {
                        let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);
                        /* for (let key in url.query) {
                            switch (key) {
                            case "product":
                            break;
                            default:
                            _response.write(key + ":  " + url.query[key] + "\n");
                            break;
                            }
                        } */
                    /*
                    let jsonString: string = JSON.stringify((url.query), null , 2);
                    _response.write(jsonString);
                }
        
                _response.end(); */
                }
            })(L06_Household || (L06_Household = {}));
            exports_1("L06_Household", L06_Household);
        }
    };
});
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
            /* console.log(this.meshTerrain) */
            if (this.meshTerrain) {
                let distance = this.meshTerrain.getTerrainInfo(this.node.mtxLocal.translation, this.cmpMeshGround.mtxWorld).distance;
                /* console.log(distance) */
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
    var ƒUi = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        battery = 1;
        exhaustion = 1;
        constructor() {
            super();
            const domVui = document.querySelector("div#vui");
            console.log("hello vui", new ƒUi.Controller(this, domVui));
        }
        reduceMutator(_mutator) { }
    }
    Script.GameState = GameState;
})(Script || (Script = {}));
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
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    let JOB;
    (function (JOB) {
        JOB[JOB["STALK"] = 0] = "STALK";
        JOB[JOB["STARE"] = 1] = "STARE";
    })(JOB || (JOB = {}));
    ƒ.Project.registerScriptNamespace(Script);
    class Slenderman extends ƒAid.ComponentStateMachine {
        static iSubclass = ƒ.Component.registerSubclass(Slenderman);
        static instructions = Slenderman.get();
        change = 0;
        target = new ƒ.Vector3();
        position = new ƒ.Vector3(0, 0, 0);
        cmpBody;
        constructor() {
            super();
            this.instructions = Slenderman.instructions;
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            console.log("hello slendi");
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        static get() {
            let setup = new ƒAid.StateMachineInstructions();
            setup.transitDefault = Slenderman.transitDefault;
            setup.actDefault = Slenderman.actDefault;
            setup.setAction(JOB.STALK, this.actStalk);
            setup.setAction(JOB.STARE, this.actStare);
            return setup;
        }
        static transitDefault(_machine) {
            console.log("Transit to", _machine.stateNext);
        }
        static async actDefault(_machine) {
            console.log(JOB[_machine.stateCurrent]);
            let graph = ƒ.Project.resources["Graph|2022-04-14T13:06:10.990Z|08163"];
            let ground = graph.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0];
            let cmpMeshGround = ground.getComponent(ƒ.ComponentMesh);
            let meshTerrain = cmpMeshGround.mesh;
            let terrainInfo = meshTerrain.getTerrainInfo(_machine.node.mtxLocal.translation, cmpMeshGround.mtxWorld);
            if (terrainInfo.distance < 0.5)
                _machine.cmpBody.applyForce(ƒ.Vector3.Y(20));
        }
        static actStalk(_machine) {
            console.log("Slendi stalk");
            /* if (rigidAvatar) {
      
              _machine.node.mtxLocal.translate(
                ƒ.Vector3.SCALE(ƒ.Vector3.Z(), ƒ.Loop.timeFrameGame / 1000)
              ); */
            //_machine.node.mtxLocal.lookAt(rigidAvatar.mtxLocal.translation, ƒ.Vector3.Y(), true);
            //}
        }
        static actStare() {
            console.log("Slendi stare");
        }
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                    this.transit(JOB.STALK);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    this.cmpBody = this.node.getComponent(ƒ.ComponentRigidbody);
                    this.cmpBody.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, (_event) => {
                        if (_event.cmpRigidbody.node.name == "Avatar") {
                            this.transit(JOB.STARE);
                            console.log("stare stare");
                        }
                        ;
                    });
                    this.cmpBody.addEventListener("TriggerLeftCollision" /* TRIGGER_EXIT */, (_event) => {
                        if (this.stateCurrent == JOB.STARE)
                            this.transit(JOB.STALK);
                    });
                    break;
            }
        };
        update = (_event) => {
            this.act();
        };
    }
    Script.Slenderman = Slenderman;
})(Script || (Script = {}));
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
//# sourceMappingURL=Script.js.map