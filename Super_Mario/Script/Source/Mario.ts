namespace Script {
    let canjump: boolean = true;
    export class Mario extends ƒ.Node {
        health: number;
        cntWalk: ƒ.Control = new ƒ.Control("cntWalk", 2, ƒ.CONTROL_TYPE.PROPORTIONAL);
        rigidMario: ƒ.ComponentRigidbody;
        sprite: ƒAid.NodeSprite;
        direction: string; 

        jumpcooldown: number = 1000;
        //canjump: boolean = true;

        constructor() {
            super("Mario");

            let mesh: ƒ.MeshCube = new ƒ.MeshCube();
            let material: ƒ.Material = new ƒ.Material("MaterialMario", ƒ.ShaderLit, new ƒ.CoatColored());
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);

            //cmpMaterial.clrPrimary = ƒ.Color.CSS("#33bb21");
            cmpMaterial.clrPrimary = new ƒ.Color(0, 0, 0, 0);
            this.addComponent(new ƒ.ComponentTransform());
            this.addComponent(new ƒ.ComponentMesh(mesh));
            this.addComponent(cmpMaterial);

            this.rigidMario = new ƒ.ComponentRigidbody();
            this.rigidMario.effectRotation = new ƒ.Vector3(0, 0, 0); 
            this.addComponent(this.rigidMario);
            this.rigidMario.friction = 0;
            this.rigidMario.effectGravity = 10;

            this.mtxLocal.scale(new ƒ.Vector3(1, 2, 1));

            this.direction = "right"; 

            this.spriteSetup();
        }

        public async spriteSetup(): Promise<void> {
            //let sprite: ƒAid.NodeSprite = await setupSprite("Mario", [1500, 250, 24, 44], 10);
            this.sprite = await setupSprite("Mario", [22, 32, 24, 40], 3, 24);
            this.sprite.mtxLocal.scale(new ƒ.Vector3(3, 1.57, 1));
            this.addChild(this.sprite);
        }

        public walk(): void {
            //effect rotation 
            let strafe: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
            /* let vector: ƒ.Vector3 = new ƒ.Vector3(-(1.5 * strafe * ƒ.Loop.timeFrameGame) / 10, 0, (this.cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 10)); */
            let vector: ƒ.Vector3 = new ƒ.Vector3(-(1.5 * strafe * ƒ.Loop.timeFrameGame) / 10, 0, 0);
            vector.transform(this.mtxLocal, false);
            this.rigidMario.setVelocity(vector);

            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT] )) {
                this.direction = "left"; 
            }
            else if ([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) {
                this.direction = "right"; 
            }
        }

        public jump(): void {
            //jump
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && canjump == true) {
                canjump = false;
                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
                    this.rigidMario.applyLinearImpulse(new ƒ.Vector3(-50, 30, 0));
                else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
                    this.rigidMario.applyLinearImpulse(new ƒ.Vector3(50, 30, 0));
                else
                    this.rigidMario.applyLinearImpulse(new ƒ.Vector3(0, 100, 0));

                setTimeout(
                    function (): void {
                        canjump = true;
                    },
                    this.jumpcooldown);
            }
        }

        public collectPowerUp(): void {
            //collect PowerUp
        }

        public playSounds(): void {
            //play Sound
        }
    }
}