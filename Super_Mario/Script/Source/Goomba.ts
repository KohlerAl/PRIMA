namespace Script {

    export class Goomba extends ƒ.Node {
        rigidGoomba: ƒ.ComponentRigidbody;
        goombaStatemachine: ƒAid.ComponentStateMachine<JOB>;
        sprite: ƒAid.NodeSprite;
        direction: string;
        groundPart: number = 0;
        position: number;
        minXPos: number;
        maxXPos: number;

        material: ƒ.ComponentMaterial; 

        constructor() {
            super("Goomba");

            let mesh: ƒ.MeshCube = new ƒ.MeshCube();
            let material: ƒ.Material = new ƒ.Material("MaterialGoomba", ƒ.ShaderLit, new ƒ.CoatColored());
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

            this.goombaStatemachine = new Enemy();
            this.addComponent(this.goombaStatemachine);

            this.spriteSetup();

            //this.direction = createRandomDirection(); 
            this.direction = "right";
            this.rigidGoomba.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, (_event: ƒ.EventPhysics) => {
                if (_event.cmpRigidbody.node.name == "Mario") {
                    this.goombaStatemachine.transit(JOB.FIGHT);
                }
            });
        }

        public update(): void {
            if (this.mtxLocal.translation.y < -5) {
                this.goombaStatemachine.transit(JOB.DIE); 
            }
        }

        public die(): void {
            /* gameState.points += numberPointsGoomba;
            console.log("die");
            this.removeComponent(this.goombaStatemachine);
            this.removeComponent(this.rigidGoomba);
            let index: number = goombas.indexOf(this); 
            goombas.splice(index, 1); 
            graph.getChildrenByName("Opponents")[0].removeChild(this); */
        }

        public flipSprite(): void {
            this.sprite.mtxLocal.reset();
            this.sprite.mtxLocal.scale(new ƒ.Vector3(2, 2, 1));

            if (this.direction == "left") {
                this.sprite.mtxLocal.rotateY(180);
            }
        }

        private async spriteSetup(): Promise<void> {
            this.sprite = await setupSprite("Goomba", [0, 0, 30, 30], 5, 32);
            this.sprite.mtxLocal.scale(new ƒ.Vector3(2, 2, 1));
            this.addChild(this.sprite);
        }

        private findPosition(): void {
            //this.groundPart = createRandomNumber(0, groundPositions.length); 

            this.position = createRandomNumber(groundPositions[this.groundPart][0], groundPositions[this.groundPart][1]);
            console.log(this.position);
            this.minXPos = groundPositions[this.groundPart][0];
            this.maxXPos = groundPositions[this.groundPart][1];
        }

    }
}