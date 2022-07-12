namespace Script {

    export class Goomba extends ƒ.Node {
        rigidGoomba: ƒ.ComponentRigidbody;
        goombaStatemachine: ƒAid.ComponentStateMachine<JOB>;
        sprite: ƒAid.NodeSprite;
        direction: string;
        groundPart: number = 0;

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
            this.mtxLocal.reset();

            let posComp: ƒ.Component = new SetPosition(); 
            this.addComponent(posComp);

            //this.mtxLocal.translateX(5);

            this.rigidGoomba = new ƒ.ComponentRigidbody();
            this.addComponent(this.rigidGoomba);
            this.rigidGoomba.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.rigidGoomba.effectGravity = 20;
            this.rigidGoomba.friction = 0; 

            this.goombaStatemachine = new Enemy();
            this.addComponent(this.goombaStatemachine);

            this.spriteSetup();

            this.direction = "right";
            this.rigidGoomba.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, (_event: ƒ.EventPhysics) => {
                if (_event.cmpRigidbody.node.name == "Mario") {
                    this.goombaStatemachine.transit(JOB.FIGHT);
                    console.log("enter");
                }
            });

            this.rigidGoomba.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_EXIT, (_event: ƒ.EventPhysics) => {
                if (_event.cmpRigidbody.node.name == "Mario") {
                    this.goombaStatemachine.transit(JOB.WALK);
                    console.log("exit");
                }
            });
        }

        public update(): void {
            if (this.mtxLocal.translation.y < -5) {
                this.goombaStatemachine.transit(JOB.DIE); 
            }
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

    }
}