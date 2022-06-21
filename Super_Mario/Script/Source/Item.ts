namespace Script {
    import ƒ = FudgeCore;
    //import ƒAid = FudgeAid;

    export class Item extends ƒ.Node {
        lifespan: number;
        type: string;
        rigidItem: ƒ.ComponentRigidbody;
        xPos: number; 

        constructor(_name: string, _type: string, xPos: number) {
            super(_name);
            this.type = _type;
            this.xPos = xPos; 
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

            let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);

            this.addComponent(cmpTransform);
            this.addComponent(cmpMesh);
            this.addComponent(cmpMaterial);
            let rigidItem: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(0, ƒ.BODY_TYPE.STATIC); 
            //rigidItem.typeBody = ƒ.BODY_TYPE.STATIC; 
            this.addComponent(rigidItem); 
            this.mtxLocal.translateY(4); 
            this.mtxLocal.translateX(this.xPos); 
            //spawn a new box 
            //create Image 
            //look for position 
        }

        changeLook(): void {
            //hello 
        }
    }
}