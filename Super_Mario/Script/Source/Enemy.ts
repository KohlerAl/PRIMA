namespace Script {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export enum JOB {
        WALK, FIGHT, DIE
    }
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
            //dconsole.log("Goomba default");
        }

        private static actFight(_machine: Enemy): void {
            let goomba: Goomba = <Goomba>_machine.node;
            let direction: string = goomba.direction;

            if (mario.direction == "left")
                direction = "left";

            else
                direction = "rightaaa";


            let vector: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);
            if (direction == "right") {
                vector = new ƒ.Vector3((1.5 * ƒ.Loop.timeFrameGame) / 15, 0, 0);
                goomba.mtxLocal.translation.x += 1 / 60;
            }

            else if (direction == "left") {
                vector = new ƒ.Vector3(-(1.5 * ƒ.Loop.timeFrameGame) / 15, 0, 0);
                goomba.mtxLocal.translation.x -= 1 / 60;
            }

            vector.transform(_machine.node.mtxLocal, false);
            let rigidGoomba: ƒ.ComponentRigidbody = _machine.node.getComponent(ƒ.ComponentRigidbody);
            rigidGoomba.setVelocity(vector);
            _machine.node.mtxLocal.translate(new ƒ.Vector3(1 / 60, 0, 0));
            //this.actWalk(_machine);
        }

        private static actWalk(_machine: Enemy): void {
            let goomba: Goomba = <Goomba>_machine.node;
            let direction: string = goomba.direction;
            let nextTile: number;
            let vector: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);

            let found: boolean = false;

            if (direction == "left") {
                nextTile = Math.ceil(goomba.mtxLocal.translation.x - 2);
                vector = new ƒ.Vector3(-(1.5 * ƒ.Loop.timeFrameGame) / 15, 0, 0);
                console.log(vector.x); 
            }

            else {
                nextTile = Math.floor(goomba.mtxLocal.translation.x + 2);
                vector = new ƒ.Vector3((1.5 * ƒ.Loop.timeFrameGame) / 15, 0, 0);
                console.log(vector.x); 
            }

            let groundParts: ƒ.Node[] = graph.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0].getChildren();
            for (let groundPart of groundParts) {
                let groundPiece: ƒ.Node[] = groundPart.getChildren();

                for (let ground of groundPiece) {
                    let nextPart: number = ground.mtxLocal.translation.x;
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
            let rigidGoomba: ƒ.ComponentRigidbody = _machine.node.getComponent(ƒ.ComponentRigidbody);
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

        private static actDie(_machine: Enemy): void {
            let goomba: Goomba = <Goomba>_machine.node;
            goomba.removeComponent(goomba.goombaStatemachine);
            goomba.removeComponent(goomba.rigidGoomba);
            //graph.getChildrenByName("Opponents")[0].removeChild(goomba);
            goombaParent.removeChild(goomba);
            /* let index: number = goombas.indexOf(goomba);
            goombas.splice(index, 1); */
            gameState.points += numberPointsGoomba;

        }

        private static transitDefault(_machine: Enemy): void {
            //console.log("Transit to", _machine.stateNext);
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