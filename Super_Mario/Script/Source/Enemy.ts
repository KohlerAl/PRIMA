namespace Script {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export enum JOB {
        WALK, FIGHT, DIE
    }
    let direction: string = "right"; 
    ƒ.Project.registerScriptNamespace(Script);
    export class Enemy extends ƒAid.ComponentStateMachine<JOB> {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(Enemy);
        private static instructions: ƒAid.StateMachineInstructions<JOB> = Enemy.get();

        constructor() {
            super();
            this.instructions = Enemy.instructions;

            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;

            this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
            this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);

        }

        public static get(): ƒAid.StateMachineInstructions<JOB> {
            let setup: ƒAid.StateMachineInstructions<JOB> = new ƒAid.StateMachineInstructions();
            setup.transitDefault = Enemy.transitDefault;
            setup.actDefault = Enemy.actDefault;
            setup.setAction(JOB.WALK, <ƒ.General>this.actWalk);
            setup.setAction(JOB.FIGHT, <ƒ.General>this.actFight);
            setup.setAction(JOB.DIE, <ƒ.General>this.actDie);

            return setup;
        }

        private static actDefault(): void {
            console.log("Goomba default");
        }

        private static actFight(): void {
            console.log("FIGHT");
        }

        private static actWalk(_machine: Enemy): void {
            console.log(direction);
            let vector: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0); 

            if (direction == "right") {
                vector = new ƒ.Vector3((1.5 * ƒ.Loop.timeFrameGame) / 15, 0, 0);
            }

            else if (direction == "left") {
                vector = new ƒ.Vector3(-(1.5 * ƒ.Loop.timeFrameGame) / 15, 0, 0);
            }
            
            vector.transform(_machine.node.mtxLocal, false);
            let rigidGoomba: ƒ.ComponentRigidbody = _machine.node.getComponent(ƒ.ComponentRigidbody); 
            rigidGoomba.setVelocity(vector);


            _machine.node.mtxLocal.translate(new ƒ.Vector3(1 / 60, 0, 0));
        }

        private static actDie(): void {
            console.log("Goomba die");
        }

        private static transitDefault(_machine: Enemy): void {
            console.log("Transit to", _machine.stateNext);
        }

        private hndEvent = (_event: Event): void => {
            switch (_event.type) {
                case ƒ.EVENT.COMPONENT_ADD:
                    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
                    this.transit(JOB.WALK);
                    break;
                case ƒ.EVENT.COMPONENT_REMOVE:
                    this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
                    this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
                    ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
                    break;
            }
        }


        private update = (_event: Event): void => {
            this.act();
        }
    }
}