namespace Script {
    import ƒ = FudgeCore;
    //import ƒAid = FudgeAid;

    export class Item extends ƒ.Node {
        type: string;
        rigidItem: ƒ.ComponentRigidbody;
        xPos: number;

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

            let material: ƒ.Material = new ƒ.Material("MaterialItem", ƒ.ShaderGouraudTextured, new ƒ.CoatRemissiveTextured(new ƒ.Color(), texture));
            this.addComponent(new ƒ.ComponentTransform());
            this.addComponent(new ƒ.ComponentMesh(mesh));
            this.addComponent(new ƒ.ComponentMaterial(material));
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
                    console.log("enter");
                    this.getItem(); 
                }
            });
        }

        getItem(): void {
            console.log("hello"); 
            // change Look 
        }


        changeLook(): void {
            //hello 
        }
    }
}