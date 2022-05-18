"use strict";
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
//# sourceMappingURL=DropToGroundInitial.js.map