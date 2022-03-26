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
    let pacman;
    let speed = new ƒ.Vector3(0, 0, 0);
    let graph;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        graph = viewport.getBranch();
        pacman = graph.getChildrenByName("Pacman")[0];
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        // Check if pacman is on the middle of the one tile if yes, he can walk in the direction of the pressed key
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]) && (pacman.mtxLocal.translation.y + 0.025) % 1 < 0.05) {
            let x = Math.round(pacman.mtxLocal.translation.x + 0.515);
            let y = Math.round(pacman.mtxLocal.translation.y);
            if (checkTile(x, y) == true) {
                speed.set(1 / 60, 0, 0);
            }
            else {
                speed.set(0, speed.y, 0);
            }
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]) && (pacman.mtxLocal.translation.y + 0.025) % 1 < 0.05) {
            let x = Math.round(pacman.mtxLocal.translation.x - 0.515);
            let y = Math.round(pacman.mtxLocal.translation.y);
            if (checkTile(x, y) == true) {
                speed.set(-1 / 60, 0, 0);
            }
            else {
                speed.set(0, speed.y, 0);
            }
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W]) && (pacman.mtxLocal.translation.x + 0.025) % 1 < 0.05) {
            let x = Math.round(pacman.mtxLocal.translation.x);
            let y = Math.round(pacman.mtxLocal.translation.y + 0.515);
            if (checkTile(x, y) == true) {
                speed.set(0, 1 / 60, 0);
            }
            else {
                speed.set(speed.x, 0, 0);
            }
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S]) && (pacman.mtxLocal.translation.x + 0.025) % 1 < 0.05) {
            let x = Math.round(pacman.mtxLocal.translation.x);
            let y = Math.round(pacman.mtxLocal.translation.y - 0.515);
            if (checkTile(x, y) == true) {
                speed.set(0, -1 / 60, 0);
            }
            else {
                speed.set(speed.x, 0, 0);
            }
        }
        pacman.mtxLocal.translate(speed);
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function checkTile(_x, _y) {
        //get the Grid as parent of all rows
        let parent = graph.getChildrenByName("Grid")[0];
        //get the row which pacman is about to enter (y-coordinate)
        let row = parent.getChildren()[_y];
        if (row) {
            //get the tile via the x-coordinate
            let tile = row.getChild(_x);
            if (tile) {
                //get the material and the color of the tile 
                let material = tile.getComponent(ƒ.ComponentMaterial);
                let color = material.clrPrimary;
                let colorR = +color.r.toFixed(2);
                let colorG = +color.g.toFixed(2);
                let colorB = +color.b.toFixed(2);
                //!!!! change here if color of walking tiles is changed !!!!
                if (colorR == 0.18 && colorG == 0.18 && colorB == 0.18) {
                    return true;
                }
            }
        }
        return false;
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map