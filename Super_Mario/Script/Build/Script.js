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
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let graph;
    let mario;
    let config;
    let countdownTime;
    let numberCoins;
    let numberOpponents;
    function start(_event) {
        viewport = _event.detail;
        graph = viewport.getBranch();
        getExternalData();
        mario = new Script.Mario();
        graph.appendChild(mario);
        console.log(mario);
        console.log(graph);
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
        numberCoins = config["numCoins"];
        numberOpponents = config["numOpponents"];
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    async function setupSprite(_name, _position, _frames) {
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("Sprites/texture.png");
        let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
        console.log(coat);
        let animation = new ƒAid.SpriteSheetAnimation(_name, coat);
        animation.generateByGrid(ƒ.Rectangle.GET(_position[0], _position[1], _position[2], _position[3]), _frames, 70, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(64));
        console.log(animation);
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
            this.addComponent(this.rigidMario);
            this.rigidMario.friction = 0;
            this.rigidMario.effectGravity = 3;
            this.mtxLocal.scale(new ƒ.Vector3(0.5, 1, 1));
            this.spriteSetup();
        }
        async spriteSetup() {
            //let sprite: ƒAid.NodeSprite = await setupSprite("Mario", [1250, 0, 24, 44], 10);
            let sprite = await Script.setupSprite("Mario", [512, 0, 64, 64], 4);
            sprite.mtxLocal.scale(new ƒ.Vector3(3, 1.48, 1));
            this.addChild(sprite);
        }
        walk() {
            let strafe = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
            let vector = new ƒ.Vector3(-(1.5 * strafe * ƒ.Loop.timeFrameGame) / 10, 0, (this.cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 10));
            vector.transform(this.mtxLocal, false);
            this.rigidMario.setVelocity(vector);
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
                    this.rigidMario.applyLinearImpulse(new ƒ.Vector3(0, 30, 0));
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