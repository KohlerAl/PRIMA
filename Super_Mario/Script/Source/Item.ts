namespace Script {
    import ƒ = FudgeCore;
    //import ƒAid = FudgeAid;

    export class Item extends ƒ.Node {
        type: string;
        rigidItem: ƒ.ComponentRigidbody;
        xPos: number;
        material: ƒ.Material;
        coin: Coin;

        looted: boolean = false;

        constructor(_name: string, _type: string) {
            super(_name);
            this.type = _type;
            this.spawn();
        }

        async spawn(): Promise<void> {
            let mesh: ƒ.MeshCube = new ƒ.MeshCube();
            let texture: ƒ.TextureImage = new ƒ.TextureImage();
            if (this.type == "powerUpBox")
                await texture.load("Sprites/powerUpBox.png");
            else
                await texture.load("Sprites/box.png");

            this.material = new ƒ.Material("MaterialItem", ƒ.ShaderGouraudTextured, new ƒ.CoatRemissiveTextured(new ƒ.Color(), texture));
            this.addComponent(new ƒ.ComponentTransform());
            this.addComponent(new ƒ.ComponentMesh(mesh));
            this.addComponent(new ƒ.ComponentMaterial(this.material));
            this.rigidItem = new ƒ.ComponentRigidbody(0, ƒ.BODY_TYPE.STATIC);
            //rigidItem.typeBody = ƒ.BODY_TYPE.STATIC; 
            this.addComponent(this.rigidItem);
            this.mtxLocal.translateY(4);

            let posComp: ƒ.Component = new SetPosition();
            this.addComponent(posComp);

            this.manageHit();
        }

        manageHit(): void {
            this.rigidItem.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, (_event: ƒ.EventPhysics) => {
                if (_event.cmpRigidbody.node.name == "Mario") {
                    this.getCoin();
                }
            });
        }

        getCoin(): void {
            if (this.looted == false) {
                this.looted = true;
                this.changeLook();
                let coin: Coin = new Coin(this.mtxLocal.translation.x, 5);

                let environment: ƒ.Node = graph.getChildrenByName("Environment")[0];
                let coinsParent: ƒ.Node = environment.getChildrenByName("Coins")[0];
                coinsParent.appendChild(coin);

                window.setTimeout(
                    function (): void {
                        coinsParent.removeChild(coin);
                    },
                    coin.lifespan
                );
            }
        }


        async changeLook(): Promise<void> {
            let texture: ƒ.TextureImage = new ƒ.TextureImage();
            await texture.load("Sprites/emptyBox.png");
            //this.material = new ƒ.Material("MaterialItem", ƒ.ShaderGouraudTextured, new ƒ.CoatRemissiveTextured(new ƒ.Color(), texture)); 
            this.material.coat = new ƒ.CoatRemissiveTextured(new ƒ.Color(), texture);
            //this.addComponent(new ƒ.ComponentMaterial(this.material)); 
        }
    }
}