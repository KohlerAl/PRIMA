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
    var ƒAid = FudgeAid;
    let JOB;
    (function (JOB) {
        JOB[JOB["WALK"] = 0] = "WALK";
        JOB[JOB["FIGHT"] = 1] = "FIGHT";
        JOB[JOB["DIE"] = 2] = "DIE";
    })(JOB = Script.JOB || (Script.JOB = {}));
    ƒ.Project.registerScriptNamespace(Script);
    class Enemy extends ƒAid.ComponentStateMachine {
        static iSubclass = ƒ.Component.registerSubclass(Enemy);
        static instructions = Enemy.get();
        constructor() {
            super();
            this.instructions = Enemy.instructions;
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
        }
        static get() {
            let setup = new ƒAid.StateMachineInstructions();
            setup.transitDefault = Enemy.transitDefault;
            setup.actDefault = Enemy.actDefault;
            setup.setAction(JOB.WALK, this.actWalk);
            setup.setAction(JOB.FIGHT, this.actFight);
            setup.setAction(JOB.DIE, this.actDie);
            return setup;
        }
        static actDefault() {
            console.log("Goomba default");
        }
        static actFight(_machine) {
            console.log("fight");
            let goomba = _machine.node;
            let direction = goomba.direction;
            if (Script.mario.direction == "left")
                direction = "left";
            else
                direction = "right";
            let vector = new ƒ.Vector3(0, 0, 0);
            if (direction == "right") {
                vector = new ƒ.Vector3((1.5 * ƒ.Loop.timeFrameGame) / 15, 0, 0);
                goomba.position += 1 / 60;
            }
            else if (direction == "left") {
                vector = new ƒ.Vector3(-(1.5 * ƒ.Loop.timeFrameGame) / 15, 0, 0);
                goomba.position -= 1 / 60;
            }
            vector.transform(_machine.node.mtxLocal, false);
            let rigidGoomba = _machine.node.getComponent(ƒ.ComponentRigidbody);
            rigidGoomba.setVelocity(vector);
            _machine.node.mtxLocal.translate(new ƒ.Vector3(1 / 60, 0, 0));
            //this.actWalk(_machine);
        }
        static actWalk(_machine) {
            console.log("walk");
            let goomba = _machine.node;
            let direction = goomba.direction;
            if (Script.isBetween(goomba.position, goomba.minXPos + 1, goomba.maxXPos - 1)) {
                console.log(direction);
                let vector = new ƒ.Vector3(0, 0, 0);
                if (direction == "right") {
                    vector = new ƒ.Vector3((1.5 * ƒ.Loop.timeFrameGame) / 15, 0, 0);
                    goomba.position += 1 / 60;
                }
                else if (direction == "left") {
                    vector = new ƒ.Vector3(-(1.5 * ƒ.Loop.timeFrameGame) / 15, 0, 0);
                    goomba.position -= 1 / 60;
                }
                vector.transform(_machine.node.mtxLocal, false);
                let rigidGoomba = _machine.node.getComponent(ƒ.ComponentRigidbody);
                rigidGoomba.setVelocity(vector);
                _machine.node.mtxLocal.translate(new ƒ.Vector3(1 / 60, 0, 0));
            }
            else {
                if (goomba.direction == "left") {
                    goomba.direction = "right";
                    goomba.position += 1 / 30;
                }
                else {
                    goomba.direction = "left";
                    goomba.position -= 1 / 30;
                }
                goomba.flipSprite();
            }
        }
        static actDie(_machine) {
            let goomba = _machine.node;
            console.log("die");
            goomba.removeComponent(goomba.goombaStatemachine);
            goomba.removeComponent(goomba.rigidGoomba);
            //graph.getChildrenByName("Opponents")[0].removeChild(goomba);
            Script.graph.removeChild(goomba);
            Script.gameState.points += Script.numberPointsGoomba;
        }
        static transitDefault(_machine) {
            console.log("Transit to", _machine.stateNext);
        }
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                    this.transit(JOB.WALK);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                    break;
            }
        };
        update = (_event) => {
            this.act();
        };
    }
    Script.Enemy = Enemy;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒUi = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        timer;
        points = 0;
        constructor(_timer) {
            super();
            const domVui = document.querySelector("div#vui");
            console.log("hello vui", new ƒUi.Controller(this, domVui));
            this.timer = _timer;
        }
        reduceMutator(_mutator) {
        }
    }
    Script.GameState = GameState;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Goomba extends ƒ.Node {
        rigidGoomba;
        goombaStatemachine;
        sprite;
        direction;
        groundPart = 0;
        position;
        minXPos;
        maxXPos;
        material;
        constructor() {
            super("Goomba");
            let mesh = new ƒ.MeshCube();
            let material = new ƒ.Material("MaterialGoomba", ƒ.ShaderLit, new ƒ.CoatColored());
            this.material = new ƒ.ComponentMaterial(material);
            this.material.clrPrimary = new ƒ.Color(0, 0, 0, 0);
            this.addComponent(new ƒ.ComponentTransform());
            this.addComponent(new ƒ.ComponentMesh(mesh));
            this.addComponent(this.material);
            /* let pos: SetPosition = new SetPosition();
            this.addComponent(pos);
            this.position = pos.createPosition(5, 60);  */
            this.findPosition();
            this.mtxLocal.reset();
            this.mtxLocal.translateX(this.position - 1);
            this.rigidGoomba = new ƒ.ComponentRigidbody();
            this.addComponent(this.rigidGoomba);
            this.rigidGoomba.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.rigidGoomba.effectGravity = 10;
            this.rigidGoomba.friction = 0;
            this.goombaStatemachine = new Script.Enemy();
            this.addComponent(this.goombaStatemachine);
            this.spriteSetup();
            //this.direction = createRandomDirection(); 
            this.direction = "right";
            this.rigidGoomba.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, (_event) => {
                if (_event.cmpRigidbody.node.name == "Mario") {
                    this.goombaStatemachine.transit(Script.JOB.FIGHT);
                }
            });
        }
        update() {
            if (this.mtxLocal.translation.y < -5) {
                this.goombaStatemachine.transit(Script.JOB.DIE);
            }
        }
        die() {
            /* gameState.points += numberPointsGoomba;
            console.log("die");
            this.removeComponent(this.goombaStatemachine);
            this.removeComponent(this.rigidGoomba);
            let index: number = goombas.indexOf(this);
            goombas.splice(index, 1);
            graph.getChildrenByName("Opponents")[0].removeChild(this); */
        }
        flipSprite() {
            this.sprite.mtxLocal.reset();
            this.sprite.mtxLocal.scale(new ƒ.Vector3(2, 2, 1));
            if (this.direction == "left") {
                this.sprite.mtxLocal.rotateY(180);
            }
        }
        async spriteSetup() {
            this.sprite = await Script.setupSprite("Goomba", [0, 0, 30, 30], 5, 32);
            this.sprite.mtxLocal.scale(new ƒ.Vector3(2, 2, 1));
            this.addChild(this.sprite);
        }
        findPosition() {
            //this.groundPart = createRandomNumber(0, groundPositions.length); 
            this.position = Script.createRandomNumber(Script.groundPositions[this.groundPart][0], Script.groundPositions[this.groundPart][1]);
            console.log(this.position);
            this.minXPos = Script.groundPositions[this.groundPart][0];
            this.maxXPos = Script.groundPositions[this.groundPart][1];
        }
    }
    Script.Goomba = Goomba;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    //import ƒAid = FudgeAid;
    class Item extends ƒ.Node {
        lifespan;
        type;
        rigidItem;
        xPos;
        constructor(_name, _type, xPos) {
            super(_name);
            this.type = _type;
            this.xPos = xPos;
            this.spawn();
        }
        async spawn() {
            let mesh = new ƒ.MeshCube();
            let texture = new ƒ.TextureImage();
            if (this.type == "powerUpBox")
                await texture.load("Sprites/powerUpBox.png");
            else
                await texture.load("Sprites/box.png");
            let material = new ƒ.Material("MaterialItem", ƒ.ShaderGouraudTextured, new ƒ.CoatRemissiveTextured(new ƒ.Color(), texture));
            let cmpTransform = new ƒ.ComponentTransform();
            let cmpMesh = new ƒ.ComponentMesh(mesh);
            let cmpMaterial = new ƒ.ComponentMaterial(material);
            this.addComponent(cmpTransform);
            this.addComponent(cmpMesh);
            this.addComponent(cmpMaterial);
            let rigidItem = new ƒ.ComponentRigidbody(0, ƒ.BODY_TYPE.STATIC);
            //rigidItem.typeBody = ƒ.BODY_TYPE.STATIC; 
            this.addComponent(rigidItem);
            this.mtxLocal.translateY(4);
            this.mtxLocal.translateX(this.xPos);
            //spawn a new box 
            //create Image 
            //look for position 
        }
        changeLook() {
            //hello 
        }
    }
    Script.Item = Item;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    document.addEventListener("interactiveViewportStarted", start);
    Script.goombas = [];
    Script.numberPointsGoomba = 1000;
    Script.groundPositions = [];
    let time;
    let config;
    let countdownTime;
    let numberBoxes;
    let numberOpponents;
    Script.blockedNumbers = [12, 13, 14, 15, 22, 23, 24, 25, 26, 27, 28, 29, 33, 34, 35, 36, 37, 45, 46, 47, 48, 49, 50, 53, 54, 55, 73, 74, 75, 76, 77, 78, 79, 89, 90, 91];
    async function start(_event) {
        Script.viewport = _event.detail;
        Script.graph = Script.viewport.getBranch();
        await getExternalData();
        getGroundParts();
        Script.mario = new Script.Mario();
        Script.graph.appendChild(Script.mario);
        Script.mario.addComponent(createCamera());
        //createCamera();
        for (let i = 0; i < 1; i++) {
            Script.goombas.push(new Script.Goomba());
            Script.graph.appendChild(Script.goombas[i]);
        }
        time = new ƒ.Time();
        Script.timer = new ƒ.Timer(time, 1000, 0, updateTimer);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        Script.mario.update();
        if (Script.goombas.length > 0) {
            for (let goomba of Script.goombas)
                goomba.update();
        }
        ƒ.Physics.simulate(); // if physics is included and used
        Script.viewport.draw();
        //ƒ.AudioManager.default.update();
    }
    Script.update = update;
    async function getExternalData() {
        let response = await fetch("config.json");
        config = await response.json();
        countdownTime = config["countdown"];
        numberBoxes = config["numBoxes"];
        numberOpponents = config["numOpponents"];
        console.log(numberOpponents);
        Script.gameState = new Script.GameState(countdownTime);
        console.log(Script.gameState);
        let boxParent = Script.graph.getChildrenByName("Environment")[0].getChildrenByName("Boxes")[0];
        //let environment: ƒ.Node = graph.getChildrenByName("Environment")[0].getChildrenByName("GroundParts")[0];
        for (let i = 0; i < numberBoxes; i++) {
            let item;
            let randomPosX = createRandomNumber(5, 68);
            for (let i = 0; i < Script.blockedNumbers.length; i++) {
                if (randomPosX == Script.blockedNumbers[i]) {
                    randomPosX -= 5;
                }
            }
            if (createRandomNumber(0, 1) == 1)
                item = new Script.Item("powerUpBox", "powerUpBox", randomPosX);
            else
                item = new Script.Item("itemBox", "box", randomPosX);
            boxParent.appendChild(item);
        }
    }
    function getGroundParts() {
        let groundParts = Script.graph.getChildrenByName("Environment")[0].getChildrenByName("GroundParts")[0].getChildren();
        for (let groundPart of groundParts) {
            let translateGround = groundPart.mtxLocal.translation.x;
            let scaleGround = groundPart.mtxLocal.scaling.x;
            Script.groundPositions.push([(translateGround - scaleGround / 2) + 1, (translateGround + scaleGround / 2) - 1]);
        }
    }
    function updateTimer() {
        Script.gameState.timer -= 1;
        if (Script.gameState.timer <= 0) {
            ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, update);
        }
    }
    function createCamera() {
        let newCam = new ƒ.ComponentCamera();
        //newCam.projectOrthographic(); 
        Script.viewport.camera = newCam;
        Script.viewport.camera.projectCentral(Script.canvas.clientWidth / Script.canvas.clientHeight, 5);
        //viewport.camera.mtxPivot.translate(new ƒ.Vector3(0, 0, 0));
        Script.viewport.camera.mtxPivot.rotateY(180);
        Script.viewport.camera.mtxPivot.translateZ(-450);
        Script.viewport.camera.mtxPivot.scale(new ƒ.Vector3(2, 1, 2));
        return newCam;
    }
    function createRandomNumber(_min, _max) {
        return Math.floor(Math.random() * (_max - _min + 1)) + _min;
    }
    Script.createRandomNumber = createRandomNumber;
    function createRandomDirection() {
        let randomNmbr = createRandomNumber(0, 1);
        if (randomNmbr == 0) {
            return "left";
        }
        else {
            return "right";
        }
    }
    Script.createRandomDirection = createRandomDirection;
    function isBetween(_x, _min, _max) {
        if (_x >= _min && _x <= _max)
            return true;
        else
            return false;
    }
    Script.isBetween = isBetween;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    async function setupSprite(_name, _position, _frames, _offset) {
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("Sprites/sprites.png");
        let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
        let animation = new ƒAid.SpriteSheetAnimation(_name, coat);
        animation.generateByGrid(ƒ.Rectangle.GET(_position[0], _position[1], _position[2], _position[3]), _frames, 70, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(_offset));
        let sprite = new ƒAid.NodeSprite("Sprite");
        sprite.setAnimation(animation);
        sprite.setFrameDirection(1);
        sprite.framerate = 5;
        let cmpTransfrom = new ƒ.ComponentTransform();
        sprite.addComponent(cmpTransfrom);
        return sprite;
    }
    Script.setupSprite = setupSprite;
    async function changeImage() {
        //change Sprite Image
    }
    Script.changeImage = changeImage;
})(Script || (Script = {}));
var Script;
(function (Script) {
    let canjump = true;
    class Mario extends ƒ.Node {
        health;
        cntWalk = new ƒ.Control("cntWalk", 2, 0 /* PROPORTIONAL */);
        rigidMario;
        sprite;
        direction;
        jumpcooldown = 1500;
        constructor() {
            super("Mario");
            let mesh = new ƒ.MeshCube();
            let material = new ƒ.Material("MaterialMario", ƒ.ShaderLit, new ƒ.CoatColored());
            let cmpMaterial = new ƒ.ComponentMaterial(material);
            //cmpMaterial.clrPrimary = ƒ.Color.CSS("#33bb21");
            cmpMaterial.clrPrimary = new ƒ.Color(0, 0, 0, 0);
            this.addComponent(new ƒ.ComponentTransform());
            let meshComponent = new ƒ.ComponentMesh(mesh);
            this.addComponent(meshComponent);
            this.addComponent(cmpMaterial);
            this.rigidMario = new ƒ.ComponentRigidbody();
            this.rigidMario.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.addComponent(this.rigidMario);
            this.rigidMario.friction = 0;
            this.rigidMario.effectGravity = 15;
            this.mtxLocal.scale(new ƒ.Vector3(1, 2, 1));
            this.direction = "right";
            this.spriteSetup();
        }
        update() {
            this.walk();
            this.jump();
            this.checkPosition();
            this.checkDeath();
        }
        collectPowerUp() {
            //collect PowerUp
        }
        playSounds() {
            //play Sound
        }
        checkPosition() {
            let canvas = document.querySelector("canvas");
            let width = canvas.width;
            let posX = this.mtxLocal.translation.x;
            console.log();
            if (!Script.isBetween(posX, 3, width - 3)) {
                if (posX < 150) {
                    this.dispatchEvent(new CustomEvent("moveCamera", {
                        bubbles: true,
                        detail: "left"
                    }));
                }
                else {
                    this.dispatchEvent(new CustomEvent("moveCamera", {
                        bubbles: true,
                        detail: "right"
                    }));
                }
            }
        }
        walk() {
            let strafe = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
            let vector = new ƒ.Vector3(-(1.5 * strafe * ƒ.Loop.timeFrameGame) / 10, 0, 0);
            vector.transform(this.mtxLocal, false);
            this.rigidMario.setVelocity(vector);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
                this.direction = "left";
                this.sprite.mtxLocal.reset();
                this.sprite.mtxLocal.scale(new ƒ.Vector3(3, 1.57, 1));
                this.sprite.mtxLocal.rotateY(180);
            }
            else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
                this.direction = "right";
                this.sprite.mtxLocal.reset();
                this.sprite.mtxLocal.scale(new ƒ.Vector3(3, 1.57, 1));
            }
        }
        jump() {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && canjump == true) {
                canjump = false;
                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
                    this.rigidMario.applyLinearImpulse(new ƒ.Vector3(-50, 150, 0));
                else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
                    this.rigidMario.applyLinearImpulse(new ƒ.Vector3(50, 150, 0));
                else
                    this.rigidMario.applyLinearImpulse(new ƒ.Vector3(0, 150, 0));
                setTimeout(function () {
                    canjump = true;
                }, this.jumpcooldown);
            }
        }
        checkDeath() {
            if (this.mtxLocal.translation.y < -1) {
                Script.graph.removeChild(this);
                ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, Script.update);
                Script.timer.clear();
            }
        }
        async spriteSetup() {
            this.sprite = await Script.setupSprite("Mario", [22, 32, 24, 40], 3, 24);
            this.sprite.mtxLocal.scale(new ƒ.Vector3(3, 1.57, 1));
            this.addChild(this.sprite);
        }
    }
    Script.Mario = Mario;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class SetPosition extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(Script.CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
        }
        createPosition(_rangeStart, _rangeEnd) {
            let rand = null;
            while (rand === null || Script.blockedNumbers.includes(rand)) {
                rand = Math.round(Math.random() * (Script.createRandomNumber(_rangeStart, _rangeEnd)));
            }
            return rand;
        }
    }
    Script.SetPosition = SetPosition;
})(Script || (Script = {}));
var Script;
(function (Script) {
    window.addEventListener("load", init);
    let dialog;
    function init(_event) {
        dialog = document.querySelector("dialog");
        dialog.querySelector("h1").textContent = document.title;
        dialog.addEventListener("click", function (_event) {
            // @ts-ignore until HTMLDialog is implemented by all browsers and available in dom.d.ts
            dialog.close();
            startInteractiveViewport();
        });
        //@ts-ignore
        dialog.showModal();
    }
    async function startInteractiveViewport() {
        await ƒ.Project.loadResourcesFromHTML();
        ƒ.Debug.log("Project:", ƒ.Project.resources);
        let graph = ƒ.Project.resources["Graph|2022-05-24T17:31:01.983Z|19489"];
        ƒ.Debug.log("Graph:", graph);
        if (!graph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }
        let cmpCamera = new ƒ.ComponentCamera();
        Script.canvas = document.querySelector("canvas");
        let viewport = new ƒ.Viewport();
        viewport.initialize("InteractiveViewport", graph, cmpCamera, Script.canvas);
        ƒ.Debug.log("Viewport:", viewport);
        viewport.draw();
        Script.canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", {
            bubbles: true,
            detail: viewport
        }));
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map