namespace Script {

    export class Goomba extends ƒ.Node {
        rigidGoomba: ƒ.ComponentRigidbody;
        goombaStatemachine: ƒAid.ComponentStateMachine<JOB>;
        sprite: ƒAid.NodeSprite;
        constructor() {
            super("Goomba");

            let mesh: ƒ.MeshCube = new ƒ.MeshCube();
            let material: ƒ.Material = new ƒ.Material("MaterialGoomba", ƒ.ShaderLit, new ƒ.CoatColored());
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);

            cmpMaterial.clrPrimary = new ƒ.Color(0, 0, 0, 0);
            this.addComponent(new ƒ.ComponentTransform());
            this.addComponent(new ƒ.ComponentMesh(mesh));
            this.addComponent(cmpMaterial);

            this.mtxLocal.translateX(8);

            this.rigidGoomba = new ƒ.ComponentRigidbody();
            this.addComponent(this.rigidGoomba);
            this.rigidGoomba.effectRotation = new ƒ.Vector3(0, 0, 0); 
            this.rigidGoomba.effectGravity = 10;

            this.goombaStatemachine = new Enemy();
            this.addComponent(this.goombaStatemachine);

            this.spriteSetup();

            this.rigidGoomba.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, (_event: ƒ.EventPhysics) => {
                if (_event.cmpRigidbody.node.name == "Mario") {
                    this.goombaStatemachine.transit(JOB.FIGHT); 
                }
            });
        }

        public async spriteSetup(): Promise<void> {
            this.sprite = await setupSprite("Goomba", [0, 0, 30, 30], 5, 32);
            this.sprite.mtxLocal.scale(new ƒ.Vector3(2, 2, 1));
            this.addChild(this.sprite);
        }
    }
}