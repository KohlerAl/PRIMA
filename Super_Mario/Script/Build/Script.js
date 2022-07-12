"use strict";
var Script;
(function (Script) {
    function setUpCam() {
        Script.camNode = new ƒ.Node("camNode");
        Script.camNode.addComponent(createCamera());
        Script.camNode.addComponent(new ƒ.ComponentTransform());
        Script.camNode.mtxLocal.scale(new ƒ.Vector3(1, 2, 1));
        let marioParent = Script.graph.getChildrenByName("Avatar")[0];
        marioParent.addChild(Script.camNode);
    }
    Script.setUpCam = setUpCam;
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
    function moveCam(_vector) {
        _vector.transform(Script.camNode.mtxLocal, false);
        _vector.scale(1 / 55);
        Script.camNode.mtxLocal.translate(_vector);
    }
    Script.moveCam = moveCam;
})(Script || (Script = {}));
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
            //dconsole.log("Goomba default");
        }
        static actFight(_machine) {
            let goomba = _machine.node;
            let direction = goomba.direction;
            if (Script.mario.direction == "left")
                direction = "left";
            else
                direction = "right";
            let vector = new ƒ.Vector3(0, 0, 0);
            if (direction == "right") {
                vector = new ƒ.Vector3((1.5 * ƒ.Loop.timeFrameGame) / 15, 0, 0);
                goomba.mtxLocal.translation.x += 1 / 60;
            }
            else if (direction == "left") {
                vector = new ƒ.Vector3(-(1.5 * ƒ.Loop.timeFrameGame) / 15, 0, 0);
                goomba.mtxLocal.translation.x -= 1 / 60;
            }
            //vector.transform(_machine.node.mtxLocal, false);
            //let rigidGoomba: ƒ.ComponentRigidbody = _machine.node.getComponent(ƒ.ComponentRigidbody);
            //rigidGoomba.setVelocity(vector);
            //_machine.node.mtxLocal.translate(new ƒ.Vector3(1 / 60, 0, 0));
            //this.actWalk(_machine);
        }
        static actWalk(_machine) {
            let goomba = _machine.node;
            let direction = goomba.direction;
            let nextTile;
            let vector = new ƒ.Vector3(0, 0, 0);
            let found = false;
            if (direction == "left") {
                nextTile = Math.ceil(goomba.mtxLocal.translation.x - 2);
                vector = new ƒ.Vector3(-(1.5 * ƒ.Loop.timeFrameGame) / 15, 0, 0);
            }
            else {
                nextTile = Math.floor(goomba.mtxLocal.translation.x + 2);
                vector = new ƒ.Vector3((1.5 * ƒ.Loop.timeFrameGame) / 15, 0, 0);
            }
            let groundParts = Script.graph.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0].getChildren();
            for (let groundPart of groundParts) {
                let groundPiece = groundPart.getChildren();
                for (let ground of groundPiece) {
                    let nextPart = ground.mtxLocal.translation.x;
                    if (nextTile == nextPart) {
                        found = true;
                    }
                }
            }
            if (found == false) {
                if (direction == "left")
                    goomba.direction = "right";
                else if (direction == "right")
                    goomba.direction = "left";
                goomba.flipSprite();
            }
            vector.transform(_machine.node.mtxLocal, false);
            let rigidGoomba = goomba.getComponent(ƒ.ComponentRigidbody);
            rigidGoomba.setVelocity(vector);
            //_machine.node.mtxLocal.translate(new ƒ.Vector3(1 / 60, 0, 0));
            /* let goomba: Goomba = <Goomba>_machine.node;
            let direction: string = goomba.direction;
            let nextTile: number;

            if (direction == "left") {
                nextTile = goomba.position
            } */
            /* if (isBetween(goomba.position, goomba.minXPos + 1, goomba.maxXPos - 1)) {
                let vector: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);
                if (direction == "right") {
                    vector = new ƒ.Vector3((1.5 * ƒ.Loop.timeFrameGame) / 15, 0, 0);
                    goomba.position += 1 / 60;
                }

                else if (direction == "left") {
                    vector = new ƒ.Vector3(-(1.5 * ƒ.Loop.timeFrameGame) / 15, 0, 0);
                    goomba.position -= 1 / 60;
                }

                vector.transform(_machine.node.mtxLocal, false);
                let rigidGoomba: ƒ.ComponentRigidbody = _machine.node.getComponent(ƒ.ComponentRigidbody);
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
            } */
        }
        static actDie(_machine) {
            let goomba = _machine.node;
            goomba.removeComponent(goomba.goombaStatemachine);
            goomba.removeComponent(goomba.rigidGoomba);
            Script.goombaParent.removeChild(goomba);
            let index = Script.goombas.indexOf(goomba);
            Script.goombas.splice(index, 1);
            Script.gameState.points += Script.numberPointsGoomba;
        }
        static transitDefault(_machine) {
            //console.log("Transit to", _machine.stateNext);
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
            this.mtxLocal.reset();
            let posComp = new Script.SetPosition();
            this.addComponent(posComp);
            //this.mtxLocal.translateX(5);
            this.rigidGoomba = new ƒ.ComponentRigidbody();
            this.addComponent(this.rigidGoomba);
            this.rigidGoomba.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.rigidGoomba.effectGravity = 20;
            this.rigidGoomba.friction = 0;
            this.goombaStatemachine = new Script.Enemy();
            this.addComponent(this.goombaStatemachine);
            this.spriteSetup();
            this.direction = "right";
            this.rigidGoomba.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, (_event) => {
                if (_event.cmpRigidbody.node.name == "Mario") {
                    this.goombaStatemachine.transit(Script.JOB.FIGHT);
                    console.log("enter");
                }
            });
            this.rigidGoomba.addEventListener("ColliderLeftCollision" /* COLLISION_EXIT */, (_event) => {
                if (_event.cmpRigidbody.node.name == "Mario") {
                    this.goombaStatemachine.transit(Script.JOB.WALK);
                    console.log("exit");
                }
            });
        }
        update() {
            if (this.mtxLocal.translation.y < -5) {
                this.goombaStatemachine.transit(Script.JOB.DIE);
            }
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
    }
    Script.Goomba = Goomba;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    //import ƒAid = FudgeAid;
    class Item extends ƒ.Node {
        type;
        rigidItem;
        xPos;
        looted = false;
        constructor(_name, _type) {
            super(_name);
            this.type = _type;
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
            this.addComponent(new ƒ.ComponentTransform());
            this.addComponent(new ƒ.ComponentMesh(mesh));
            this.addComponent(new ƒ.ComponentMaterial(material));
            this.rigidItem = new ƒ.ComponentRigidbody(0, ƒ.BODY_TYPE.STATIC);
            //rigidItem.typeBody = ƒ.BODY_TYPE.STATIC; 
            this.addComponent(this.rigidItem);
            this.mtxLocal.translateY(4);
            let posComp = new Script.SetPosition();
            this.addComponent(posComp);
            this.manageHit();
        }
        manageHit() {
            this.rigidItem.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, (_event) => {
                if (_event.cmpRigidbody.node.name == "Mario") {
                    console.log("enter");
                    this.getItem();
                }
            });
        }
        getItem() {
            console.log("hello");
            // change Look 
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
    document.addEventListener("interactiveViewportStarted", start);
    Script.goombas = [];
    Script.numberPointsGoomba = 1000;
    let time;
    let config;
    let countdownTime;
    let numberBoxes;
    let numberOpponents;
    Script.tileNumbers = [];
    async function start(_event) {
        //get viewport and graph
        Script.viewport = _event.detail;
        Script.graph = Script.viewport.getBranch();
        //get positions from ground parts, get external data and create Boxes
        getGroundParts();
        await getExternalData();
        createBoxes();
        //create Mario
        Script.mario = new Script.Mario();
        let marioParent = Script.graph.getChildrenByName("Avatar")[0];
        marioParent.appendChild(Script.mario);
        Script.setUpCam();
        //create opponents
        for (let i = 0; i < numberOpponents; i++) {
            Script.goombas.push(new Script.Goomba());
            Script.goombaParent = Script.graph.getChildrenByName("Opponents")[0];
            Script.goombaParent.appendChild(Script.goombas[i]);
        }
        //start timer
        time = new ƒ.Time();
        Script.timer = new ƒ.Timer(time, 1000, 0, updateTimer);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        Script.mario.update();
        for (let goomba of Script.goombas)
            goomba.update();
        ƒ.Physics.simulate();
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
        Script.gameState = new Script.GameState(countdownTime);
    }
    function getGroundParts() {
        let groundParts = Script.graph.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0].getChildren();
        for (let groundPart of groundParts) {
            let groundPiece = groundPart.getChildren();
            for (let ground of groundPiece) {
                Script.tileNumbers.push(ground.mtxLocal.translation.x);
            }
        }
        /* let obstacles: ƒ.Node = graph.getChildrenByName("Environment")[0].getChildrenByName("Obstacles")[0];
        let pieces: ƒ.Node[] = obstacles.getChildren();
    
        for (let obstacleParent of pieces) {
          let singleObstacle: ƒ.Node[] = obstacleParent.getChildren();
    
          for (let obstacle of singleObstacle) {
            if (tileNumbers.includes(Math.floor(obstacle.mtxLocal.translation.x))) {
              let index: number = tileNumbers.indexOf(obstacle.mtxLocal.translation.x);
              tileNumbers.splice(index, 1);
            }
          }
        } */
    }
    function createBoxes() {
        let boxParent = Script.graph.getChildrenByName("Environment")[0].getChildrenByName("Boxes")[0];
        for (let i = 0; i < numberBoxes; i++) {
            let item;
            if (createRandomNumber(0, 1) == 1)
                item = new Script.Item("powerUpBox", "powerUpBox");
            else
                item = new Script.Item("itemBox", "box");
            boxParent.appendChild(item);
        }
    }
    function updateTimer() {
        Script.gameState.timer -= 1;
        if (Script.gameState.timer <= 0) {
            ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, update);
        }
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
        sprite.framerate = 6;
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
            cmpMaterial.clrPrimary = new ƒ.Color(0, 0, 0, 0);
            this.addComponent(new ƒ.ComponentTransform());
            this.addComponent(new ƒ.ComponentMesh(mesh));
            this.addComponent(cmpMaterial);
            this.mtxLocal.translateX(1);
            this.rigidMario = new ƒ.ComponentRigidbody();
            this.rigidMario.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.addComponent(this.rigidMario);
            this.rigidMario.friction = 0;
            this.rigidMario.effectGravity = 15;
            this.rigidMario.setVelocity(new ƒ.Vector3(-1, 0, 0));
            this.mtxLocal.scale(new ƒ.Vector3(1, 2, 1));
            this.direction = "right";
            this.spriteSetup();
        }
        update() {
            this.walk();
            this.jump();
            this.checkDeath();
        }
        collectPowerUp() {
            //collect PowerUp
        }
        playSounds() {
            //play Sound
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
            Script.moveCam(vector);
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
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.createPosition);
        }
        createPosition() {
            let randomPos = Script.createRandomNumber(5, Script.tileNumbers.length);
            this.node.mtxLocal.translateX(Script.tileNumbers[randomPos]);
            Script.tileNumbers.splice(randomPos, 1);
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