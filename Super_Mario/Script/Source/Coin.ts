namespace Script {
    export class Coin extends ƒ.Node {
        positionX: number;
        positionY: number;
        lifespan: number = 1000;
        parentItem: Item; 
        coinSound: ƒ.ComponentAudio;

        constructor(_x: number, _y: number) {
            super("Coin");
            this.positionX = _x;
            this.positionY = _y;
            this.coinSound = graph.getChildrenByName("Sounds")[0].getChildrenByName("Coin")[0].getComponents(ƒ.ComponentAudio)[0];
            this.spawn();
            this.animateCoin();
        }

        async spawn(): Promise<void> {
            let mesh: ƒ.MeshCube = new ƒ.MeshCube();
            let texture: ƒ.TextureImage = new ƒ.TextureImage();

            await texture.load("Sprites/coin.png");

            let material: ƒ.Material = new ƒ.Material("MaterialItem", ƒ.ShaderGouraudTextured, new ƒ.CoatRemissiveTextured(new ƒ.Color(), texture));
            this.addComponent(new ƒ.ComponentTransform());
            this.addComponent(new ƒ.ComponentMesh(mesh));
            this.addComponent(new ƒ.ComponentMaterial(material));

            this.mtxLocal.translateX(this.positionX);
            this.mtxLocal.translateY(this.positionY);
            this.coinSound.play(true); 
        }

        animateCoin(): void {

            let animseq: ƒ.AnimationSequence = new ƒ.AnimationSequence();
            animseq.addKey(new ƒ.AnimationKey(0, 5));
            animseq.addKey(new ƒ.AnimationKey(750, 6.5));
            animseq.addKey(new ƒ.AnimationKey(1000, 5));

            let animStructure: ƒ.AnimationStructure = {
                components: {
                    ComponentTransform: [
                        {
                            "ƒ.ComponentTransform": {
                                mtxLocal: {
                                    translation: {
                                        y: animseq
                                    }
                                }
                            }
                        }
                    ]
                }
            };

            let animation: ƒ.Animation = new ƒ.Animation("testAnimation", animStructure);
            let cmpAnimator: ƒ.ComponentAnimator = new ƒ.ComponentAnimator(animation);
            this.addComponent(cmpAnimator);

        }

        countdown(): void {
            this.lifespan -= 1;

        }
    }
}