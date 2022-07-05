namespace Script {
    import ƒ = FudgeCore;
    //import ƒAid = FudgeAid;

    export class Item extends ƒ.Node {
        lifespan: number;
        type: string;
        rigidItem: ƒ.ComponentRigidbody;
        xPos: number; 

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
            let rigidItem: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(0, ƒ.BODY_TYPE.STATIC); 
            //rigidItem.typeBody = ƒ.BODY_TYPE.STATIC; 
            this.addComponent(rigidItem); 
            this.mtxLocal.translateY(4); 

            let posComp: ƒ.Component = new SetPosition(); 
            this.addComponent(posComp);
        }

        changeLook(): void {
            //hello 
        }
    }
}