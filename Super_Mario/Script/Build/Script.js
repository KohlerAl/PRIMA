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
        static actFight() {
            console.log("FIGHT");
        }
        static actWalk() {
            console.log("Goomba walk");
        }
        static actDie() {
            console.log("Goomba die");
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
        constructor() {
            super("Goomba");
            let mesh = new ƒ.MeshCube();
            let material = new ƒ.Material("MaterialGoomba", ƒ.ShaderLit, new ƒ.CoatColored());
            let cmpMaterial = new ƒ.ComponentMaterial(material);
            cmpMaterial.clrPrimary = new ƒ.Color(0, 0, 0, 0);
            this.addComponent(new ƒ.ComponentTransform());
            this.addComponent(new ƒ.ComponentMesh(mesh));
            this.addComponent(cmpMaterial);
            this.mtxLocal.translateX(8);
            this.rigidGoomba = new ƒ.ComponentRigidbody();
            this.addComponent(this.rigidGoomba);
            this.rigidGoomba.effectGravity = 10;
            this.goombaStatemachine = new Script.Enemy();
            this.addComponent(new Script.Enemy());
            this.spriteSetup();
            this.rigidGoomba.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, (_event) => {
                if (_event.cmpRigidbody.node.name == "Mario") {
                    this.goombaStatemachine.transit(Script.JOB.FIGHT);
                }
            });
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
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let graph;
    let mario;
    let gameState;
    let config;
    let countdownTime;
    let numberBoxes;
    let numberOpponents;
    let blockedNumbers = [22, 23, 24, 25, 26, 27, 34, 35, 36, 37, 47, 48, 49, 50];
    function start(_event) {
        viewport = _event.detail;
        graph = viewport.getBranch();
        getExternalData();
        viewport.camera.projectCentral(5, 2);
        viewport.camera.mtxPivot.translateZ(-455);
        viewport.camera.mtxPivot.translateY(4.5);
        viewport.camera.mtxPivot.translateX(-11.5);
        mario = new Script.Mario();
        graph.appendChild(mario);
        let goomba = new Script.Goomba();
        graph.appendChild(goomba);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        mario.walk();
        mario.jump();
        ƒ.Physics.simulate(); // if physics is included and used
        viewport.draw();
        //ƒ.AudioManager.default.update();
    }
    async function getExternalData() {
        let response = await fetch("config.json");
        config = await response.json();
        countdownTime = config["countdown"];
        numberBoxes = config["numBoxes"];
        numberOpponents = config["numOpponents"];
        console.log(numberOpponents);
        gameState = new Script.GameState(countdownTime);
        console.log(gameState);
        let boxParent = graph.getChildrenByName("Environment")[0].getChildrenByName("Boxes")[0];
        //let environment: ƒ.Node = graph.getChildrenByName("Environment")[0].getChildrenByName("GroundParts")[0];
        for (let i = 0; i < numberBoxes; i++) {
            let item;
            let randomPosX = createRandomNumber(5, 68);
            for (let i = 0; i < blockedNumbers.length; i++) {
                if (randomPosX == blockedNumbers[i]) {
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
    function createRandomNumber(_min, _max) {
        return Math.floor(Math.random() * (_max - _min + 1)) + _min;
    }
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
        jumpcooldown = 1000;
        //canjump: boolean = true;
        constructor() {
            super("Mario");
            let mesh = new ƒ.MeshCube();
            let material = new ƒ.Material("MaterialMario", ƒ.ShaderLit, new ƒ.CoatColored());
            let cmpMaterial = new ƒ.ComponentMaterial(material);
            //cmpMaterial.clrPrimary = ƒ.Color.CSS("#33bb21");
            cmpMaterial.clrPrimary = new ƒ.Color(0, 0, 0, 0);
            this.addComponent(new ƒ.ComponentTransform());
            this.addComponent(new ƒ.ComponentMesh(mesh));
            this.addComponent(cmpMaterial);
            this.rigidMario = new ƒ.ComponentRigidbody();
            this.rigidMario.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.addComponent(this.rigidMario);
            this.rigidMario.friction = 0;
            this.rigidMario.effectGravity = 10;
            this.mtxLocal.scale(new ƒ.Vector3(1, 2, 1));
            this.direction = "right";
            this.spriteSetup();
        }
        async spriteSetup() {
            //let sprite: ƒAid.NodeSprite = await setupSprite("Mario", [1500, 250, 24, 44], 10);
            this.sprite = await Script.setupSprite("Mario", [22, 32, 24, 40], 3, 24);
            this.sprite.mtxLocal.scale(new ƒ.Vector3(3, 1.57, 1));
            this.addChild(this.sprite);
        }
        walk() {
            //effect rotation 
            let strafe = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
            /* let vector: ƒ.Vector3 = new ƒ.Vector3(-(1.5 * strafe * ƒ.Loop.timeFrameGame) / 10, 0, (this.cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 10)); */
            let vector = new ƒ.Vector3(-(1.5 * strafe * ƒ.Loop.timeFrameGame) / 10, 0, 0);
            vector.transform(this.mtxLocal, false);
            this.rigidMario.setVelocity(vector);
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
                this.direction = "left";
            }
            else if ([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) {
                this.direction = "right";
            }
        }
        jump() {
            //jump
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && canjump == true) {
                canjump = false;
                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
                    this.rigidMario.applyLinearImpulse(new ƒ.Vector3(-50, 30, 0));
                else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
                    this.rigidMario.applyLinearImpulse(new ƒ.Vector3(50, 30, 0));
                else
                    this.rigidMario.applyLinearImpulse(new ƒ.Vector3(0, 100, 0));
                setTimeout(function () {
                    canjump = true;
                }, this.jumpcooldown);
            }
        }
        collectPowerUp() {
            //collect PowerUp
        }
        playSounds() {
            //play Sound
        }
    }
    Script.Mario = Mario;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map