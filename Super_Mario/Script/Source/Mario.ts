namespace Script {
    let canjump: boolean = true;

    export class Mario extends ƒ.Node {
        health: number;
        cntWalk: ƒ.Control = new ƒ.Control("cntWalk", 2, ƒ.CONTROL_TYPE.PROPORTIONAL);
        rigidMario: ƒ.ComponentRigidbody;
        sprite: ƒAid.NodeSprite;
        direction: string;
        jumpcooldown: number = 1500;

        constructor() {
            super("Mario");

            let mesh: ƒ.MeshCube = new ƒ.MeshCube();
            let material: ƒ.Material = new ƒ.Material("MaterialMario", ƒ.ShaderLit, new ƒ.CoatColored());
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);

            //cmpMaterial.clrPrimary = ƒ.Color.CSS("#33bb21");
            cmpMaterial.clrPrimary = new ƒ.Color(0, 0, 0, 0);
            this.addComponent(new ƒ.ComponentTransform());
            let meshComponent: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);
            this.addComponent(meshComponent); 
            this.addComponent(cmpMaterial);

            this.rigidMario = new ƒ.ComponentRigidbody();
            this.rigidMario.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.addComponent(this.rigidMario);
            this.rigidMario.friction = 0;
            this.rigidMario.effectGravity = 15;

            this.mtxLocal.scale(new ƒ.Vector3(1, 2, 1));

            this.direction = "right";

            this.spriteSetup();
        }

        public update(): void {
            this.walk();
            this.jump();
            this.checkPosition(); 
            this.checkDeath();
        }

        public collectPowerUp(): void {
            //collect PowerUp
        }

        public playSounds(): void {
            //play Sound
        }

        private checkPosition(): void {
            let canvas: HTMLCanvasElement = document.querySelector("canvas"); 
            let width: number = canvas.width; 
            let posX: number = this.mtxLocal.translation.x; 
            console.log(); 

            if (!isBetween(posX, 3, width - 3)) {
                if (posX < 150) {
                    this.dispatchEvent(
                        new CustomEvent("moveCamera", {
                            bubbles: true, 
                            detail: "left"
                        })); 
                }
                else {
                    this.dispatchEvent(
                        new CustomEvent("moveCamera", {
                            bubbles: true, 
                            detail: "right"
                        }));
                }
            }
        }

        private walk(): void {
            let strafe: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
            let vector: ƒ.Vector3 = new ƒ.Vector3(-(1.5 * strafe * ƒ.Loop.timeFrameGame) / 10, 0, 0);
            vector.transform(this.mtxLocal, false);
            this.rigidMario.setVelocity(vector);

            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
                this.direction = "left";
                this.sprite.mtxLocal.reset();
                this.sprite.mtxLocal.scale(new ƒ.Vector3(3, 1.57, 1));
                this.sprite.mtxLocal.rotateY(180);
            }

            else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
                this.direction = "right";
                this.sprite.mtxLocal.reset();
                this.sprite.mtxLocal.scale(new ƒ.Vector3(3, 1.57, 1));
            }
        }

        private jump(): void {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && canjump == true) {
                canjump = false;
                if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
                    this.rigidMario.applyLinearImpulse(new ƒ.Vector3(-50, 150, 0));
                else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
                    this.rigidMario.applyLinearImpulse(new ƒ.Vector3(50, 150, 0));
                else
                    this.rigidMario.applyLinearImpulse(new ƒ.Vector3(0, 150, 0));

                setTimeout(
                    function (): void {
                        canjump = true;
                    },
                    this.jumpcooldown);
            }

        }

        private checkDeath(): void {
            if (this.mtxLocal.translation.y < -1) {
                graph.removeChild(this);
                ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, update);
                timer.clear(); 
            }
        }

        private async spriteSetup(): Promise<void> {
            this.sprite = await setupSprite("Mario", [22, 32, 24, 40], 3, 24);
            this.sprite.mtxLocal.scale(new ƒ.Vector3(3, 1.57, 1));
            this.addChild(this.sprite);
        }
    }
}