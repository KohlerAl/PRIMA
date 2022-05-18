"use strict";
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
//# sourceMappingURL=Slendi.js.map