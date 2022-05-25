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
    Script.ghostyGang = [];
    let positionArr = [new ƒ.Vector3(2, 1, 0), new ƒ.Vector3(8, 8, 0), new ƒ.Vector3(2, 6, 0), new ƒ.Vector3(7, 2, 0)];
    let spritePositions = [[512, 0, 64, 64], [760, 0, 64, 64], [0, 64, 62, 64], [250, 64, 62, 64]];
    let animations;
    let sprite;
    class Ghosty extends ƒ.Node {
        possibleDirections = [];
        walkDirection = "right";
        lastDirection = "down";
        spritePosition;
        speed = new ƒ.Vector3(0, 0, 0);
        constructor(_positionX, _positionY, _spritePosition) {
            super("Ghosty");
            let mesh = new ƒ.MeshSphere();
            let material = new ƒ.Material("MaterialGhosty", ƒ.ShaderLit, new ƒ.CoatColored());
            let cmpTransform = new ƒ.ComponentTransform();
            let cmpMesh = new ƒ.ComponentMesh(mesh);
            let cmpMaterial = new ƒ.ComponentMaterial(material);
            cmpMaterial.clrPrimary = ƒ.Color.CSS("#33bb21");
            this.addComponent(cmpTransform);
            this.addComponent(cmpMesh);
            this.addComponent(cmpMaterial);
            this.mtxLocal.translateX(_positionX);
            this.mtxLocal.translateY(_positionY);
            this.spritePosition = _spritePosition;
        }
        checkPosition() {
            if (this.walkDirection == "up" || this.walkDirection == "down") {
                if ((this.mtxLocal.translation.y + 0.025) % 1 < 0.05)
                    this.checkNextTile();
            }
            else if (this.walkDirection == "right" || this.walkDirection == "left") {
                if ((this.mtxLocal.translation.x + 0.025) % 1 < 0.05)
                    this.checkNextTile();
            }
            this.walk();
        }
        checkNextTile() {
            if (Script.checkTile(Math.round(this.mtxLocal.translation.x + 0.515), Math.round(this.mtxLocal.translation.y))) {
                if (this.lastDirection == "right")
                    this.possibleDirections.push("right");
                else
                    this.possibleDirections.push("right", "right", "right", "right", "right", "right");
            }
            if (Script.checkTile(Math.round(this.mtxLocal.translation.x - 0.515), Math.round(this.mtxLocal.translation.y))) {
                if (this.lastDirection == "left")
                    this.possibleDirections.push("left");
                else
                    this.possibleDirections.push("left", "left", "left", "left", "left", "left");
            }
            if (Script.checkTile(Math.round(this.mtxLocal.translation.x), Math.round(this.mtxLocal.translation.y + 0.515))) {
                if (this.lastDirection == "up")
                    this.possibleDirections.push("up");
                else
                    this.possibleDirections.push("up", "up", "up", "up", "up", "up");
            }
            if (Script.checkTile(Math.round(this.mtxLocal.translation.x), Math.round(this.mtxLocal.translation.y - 0.515))) {
                if (this.lastDirection == "down")
                    this.possibleDirections.push("down");
                else
                    this.possibleDirections.push("down", "down", "down", "down", "down", "down");
            }
            this.lastDirection = this.walkDirection;
            this.walkDirection = this.possibleDirections[Math.floor(Math.random() * this.possibleDirections.length)];
            this.possibleDirections = [];
        }
        walk() {
            if (this.walkDirection == "right") {
                this.speed.set(1 / 60, 0, 0);
            }
            else if (this.walkDirection == "left") {
                this.speed.set(-1 / 60, 0, 0);
            }
            else if (this.walkDirection == "up") {
                this.speed.set(0, 1 / 60, 0);
            }
            else if (this.walkDirection == "down") {
                this.speed.set(0, -1 / 60, 0);
            }
        }
        async createSprite() {
            let imgSpriteSheet = new ƒ.TextureImage();
            await imgSpriteSheet.load("Assets/texture.png");
            let spriteSheet = new ƒ.CoatTextured(undefined, imgSpriteSheet);
            animations = {};
            let name = "ghosty";
            let spriteGrid = new ƒAid.SpriteSheetAnimation(name, spriteSheet);
            spriteGrid.generateByGrid(ƒ.Rectangle.GET(this.spritePosition[0], this.spritePosition[1], this.spritePosition[2], this.spritePosition[3]), 4, 70, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(64));
            animations[name] = spriteGrid;
            sprite = new ƒAid.NodeSprite("Sprite");
            sprite.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
            sprite.setAnimation(animations["ghosty"]);
            sprite.setFrameDirection(1);
            sprite.mtxLocal.translateZ(0.5);
            sprite.framerate = 3;
            this.addChild(sprite);
            this.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
        }
    }
    Script.Ghosty = Ghosty;
    async function ghostySetup() {
        for (let i = 0; i < 4; i++) {
            let ghosty = new Ghosty(positionArr[i].x, positionArr[i].y, spritePositions[i]);
            Script.graph.addChild(ghosty);
            Script.ghostyGang.push(ghosty);
            ghosty.createSprite();
            console.log(ghosty);
        }
    }
    Script.ghostySetup = ghostySetup;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let dialog;
    let pacman;
    let speed = new ƒ.Vector3(0, 0, 0);
    let oldSpeed = new ƒ.Vector3(0, 0, 0);
    let chomp;
    let animations;
    let sprite;
    window.addEventListener("load", handleLoad);
    document.addEventListener("interactiveViewportStarted", start);
    function handleLoad(_event) {
        dialog = document.querySelector("dialog");
        dialog.querySelector("h1").textContent = document.title;
        dialog.addEventListener("click", function (_event) {
            // @ts-ignore until HTMLDialog is implemented by all browsers and available in dom.d.ts
            dialog.close();
            startInteractiveViewport();
        });
        // @ts-ignore
        dialog.showModal();
    }
    async function startInteractiveViewport() {
        await ƒ.Project.loadResourcesFromHTML();
        ƒ.Debug.log("Project:", ƒ.Project.resources);
        let graph = ƒ.Project.resources["Graph|2022-03-17T14:08:03.670Z|98238"];
        ƒ.Debug.log("Graph:", graph);
        if (!graph) {
            alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
            return;
        }
        let cmpCamera = new ƒ.ComponentCamera();
        let canvas = document.querySelector("canvas");
        let viewport = new ƒ.Viewport();
        viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
        ƒ.Debug.log("Viewport:", viewport);
        await loadSprites();
        viewport.draw();
        canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", {
            bubbles: true,
            detail: viewport
        }));
    }
    function start(_event) {
        viewport = _event.detail;
        Script.graph = viewport.getBranch();
        pacman = Script.graph.getChildrenByName("Pacman")[0];
        viewport.camera.mtxPivot.translate(new ƒ.Vector3(4, 4, 15));
        viewport.camera.mtxPivot.rotateY(180);
        chomp = Script.graph.getChildrenByName("Sound")[0].getComponents(ƒ.ComponentAudio)[1];
        oldSpeed.x = speed.x;
        oldSpeed.y = speed.y;
        Script.ghostySetup();
        createSprite();
        ƒ.AudioManager.default.listenTo(Script.graph);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        // Check if pacman is on the middle of the one tile if yes, he can walk in the direction of the pressed key
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]) && (pacman.mtxLocal.translation.y + 0.025) % 1 < 0.05)
            speed.set(1 / 60, 0, 0);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]) && (pacman.mtxLocal.translation.y + 0.025) % 1 < 0.05)
            speed.set(-1 / 60, 0, 0);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W]) && (pacman.mtxLocal.translation.x + 0.025) % 1 < 0.05)
            speed.set(0, 1 / 60, 0);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S]) && (pacman.mtxLocal.translation.x + 0.025) % 1 < 0.05)
            speed.set(0, -1 / 60, 0);
        speed = checkDirection(speed);
        if (speed.x != 0 && !chomp.isPlaying || speed.y != 0 && !chomp.isPlaying)
            chomp.play(true);
        if (speed.x != oldSpeed.x || speed.y != oldSpeed.y)
            rotateSprite(speed);
        pacman.mtxLocal.translate(speed);
        for (let i = 0; i < Script.ghostyGang.length; i++) {
            Script.ghostyGang[i].checkPosition();
            Script.ghostyGang[i].mtxLocal.translate(Script.ghostyGang[i].speed);
        }
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function checkDirection(_speed) {
        if (Math.sign(_speed.x) == 1) {
            if (!checkTile(Math.round(pacman.mtxLocal.translation.x + 0.515), Math.round(pacman.mtxLocal.translation.y)))
                _speed.set(0, _speed.y, 0);
        }
        if (Math.sign(_speed.x) == -1) {
            if (!checkTile(Math.round(pacman.mtxLocal.translation.x - 0.515), Math.round(pacman.mtxLocal.translation.y)))
                _speed.set(0, _speed.y, 0);
        }
        if (Math.sign(_speed.y) == 1) {
            if (!checkTile(Math.round(pacman.mtxLocal.translation.x), Math.round(pacman.mtxLocal.translation.y + 0.515)))
                _speed.set(_speed.x, 0, 0);
        }
        if (Math.sign(_speed.y) == -1) {
            if (!checkTile(Math.round(pacman.mtxLocal.translation.x), Math.round(pacman.mtxLocal.translation.y - 0.515)))
                _speed.set(_speed.x, 0, 0);
        }
        return _speed;
    }
    function checkTile(_x, _y) {
        //get the row which pacman is about to enter (y-coordinate)
        let row = Script.graph.getChildrenByName("Grid")[0].getChildren()[_y];
        if (row) {
            //get the tile via the x-coordinate
            let tile = row.getChild(_x);
            if (tile) {
                //get the color of the tile 
                let color = tile.getComponent(ƒ.ComponentMaterial).clrPrimary;
                //!!!! change here if color of walking tiles is changed !!!!
                if (+color.r.toFixed(2) == 0.18 && +color.g.toFixed(2) == 0.18 && +color.b.toFixed(2) == 0.18)
                    return true;
            }
        }
        return false;
    }
    Script.checkTile = checkTile;
    function createSprite() {
        sprite = new ƒAid.NodeSprite("Sprite");
        sprite.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        sprite.setAnimation(animations["pacman"]);
        sprite.setFrameDirection(1);
        sprite.mtxLocal.translateZ(0.5);
        sprite.framerate = 15;
        pacman.addChild(sprite);
        pacman.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
        sprite.mtxLocal.rotateZ(90);
    }
    async function loadSprites() {
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("Assets/texture.png");
        let spriteSheet = new ƒ.CoatTextured(undefined, imgSpriteSheet);
        generateSprite(spriteSheet);
    }
    function generateSprite(_spritesheet) {
        animations = {};
        let name = "pacman";
        let sprite = new ƒAid.SpriteSheetAnimation(name, _spritesheet);
        sprite.generateByGrid(ƒ.Rectangle.GET(0, 0, 64, 64), 8, 70, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(64));
        animations[name] = sprite;
    }
    function rotateSprite(_speed) {
        if (_speed.x != 0 || _speed.y != 0) {
            let currentValue = sprite.mtxLocal.rotation.z;
            let rotateValue = 360 - currentValue;
            sprite.mtxLocal.rotateZ(rotateValue);
            if (Math.sign(_speed.x) == 1) {
                sprite.mtxLocal.rotateZ(0);
            }
            if (Math.sign(_speed.x) == -1) {
                sprite.mtxLocal.rotateZ(180);
            }
            if (Math.sign(_speed.y) == 1) {
                sprite.mtxLocal.rotateZ(90);
            }
            if (Math.sign(_speed.y) == -1) {
                sprite.mtxLocal.rotateZ(270);
            }
            oldSpeed.x = speed.x;
            oldSpeed.y = speed.y;
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map