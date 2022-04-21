namespace Script {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    export let ghostyGang: Ghosty[] = [];
    let positionArr: ƒ.Vector3[] = [new ƒ.Vector3(2, 1, 0), new ƒ.Vector3(8, 8, 0), new ƒ.Vector3(2, 6, 0), new ƒ.Vector3(7, 2, 0)];
    let spritePositions: number[][] = [[512, 0, 64, 64], [760, 0, 64, 64], [0, 64, 62, 64], [250, 64, 62, 64]];
    let animations: ƒAid.SpriteSheetAnimations;
    let sprite: ƒAid.NodeSprite;

    export class Ghosty extends ƒ.Node {
        possibleDirections: string[] = [];
        walkDirection: string = "right";
        lastDirection: string = "down";
        spritePosition: number[];
        speed: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);

        constructor(_positionX: number, _positionY: number, _spritePosition: number[]) {
            super("Ghosty");
            let mesh: ƒ.MeshSphere = new ƒ.MeshSphere();
            let material: ƒ.Material = new ƒ.Material("MaterialGhosty", ƒ.ShaderLit, new ƒ.CoatColored());

            let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);
            let cmpMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(material);

            cmpMaterial.clrPrimary = ƒ.Color.CSS("#33bb21");

            this.addComponent(cmpTransform);
            this.addComponent(cmpMesh);
            this.addComponent(cmpMaterial);

            this.mtxLocal.translateX(_positionX);
            this.mtxLocal.translateY(_positionY);

            this.spritePosition = _spritePosition;
        }

        checkPosition(): void {
            if (this.walkDirection == "up" || this.walkDirection == "down") {
                if ((this.mtxLocal.translation.y + 0.025) % 1 < 0.05)
                    this.checkNextTile();
            }
            else if (this.walkDirection == "right" || this.walkDirection == "left") {
                if ((this.mtxLocal.translation.x + 0.025) % 1 < 0.05)
                    this.checkNextTile();
            }
            this.walk();
        }
        
        checkNextTile(): void {
            if (checkTile(Math.round(this.mtxLocal.translation.x + 0.515), Math.round(this.mtxLocal.translation.y))) {
                if (this.lastDirection == "right")
                    this.possibleDirections.push("right");
                else
                    this.possibleDirections.push("right", "right", "right", "right", "right", "right");
            }
            if (checkTile(Math.round(this.mtxLocal.translation.x - 0.515), Math.round(this.mtxLocal.translation.y))) {
                if (this.lastDirection == "left")
                    this.possibleDirections.push("left");
                else
                    this.possibleDirections.push("left", "left", "left", "left", "left", "left");
            }
            if (checkTile(Math.round(this.mtxLocal.translation.x), Math.round(this.mtxLocal.translation.y + 0.515))) {
                if (this.lastDirection == "up")
                    this.possibleDirections.push("up");
                else
                    this.possibleDirections.push("up", "up", "up", "up", "up", "up");
            }
            if (checkTile(Math.round(this.mtxLocal.translation.x), Math.round(this.mtxLocal.translation.y - 0.515))) {
                if (this.lastDirection == "down")
                    this.possibleDirections.push("down");
                else
                    this.possibleDirections.push("down", "down", "down", "down", "down", "down");
            }
            this.lastDirection = this.walkDirection;
            this.walkDirection = this.possibleDirections[Math.floor(Math.random() * this.possibleDirections.length)];
            this.possibleDirections = [];
        }

        walk(): void {

            if (this.walkDirection == "right") {
                this.speed.set(1 / 60, 0, 0);
            }
            else if (this.walkDirection == "left") {
                this.speed.set(-1 / 60, 0, 0);
            }
            else if (this.walkDirection == "up") {
                this.speed.set(0, 1 / 60, 0);
            }
            else if (this.walkDirection == "down") {
                this.speed.set(0, -1 / 60, 0);
            }
        }

        async createSprite(): Promise<void> {
            let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
            await imgSpriteSheet.load("Assets/texture.png");
            let spriteSheet: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);
            animations = {};
            let name: string = "ghosty";
            let spriteGrid: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation(name, spriteSheet);
            spriteGrid.generateByGrid(ƒ.Rectangle.GET(this.spritePosition[0], this.spritePosition[1], this.spritePosition[2], this.spritePosition[3]), 4, 70, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(64));
            animations[name] = spriteGrid;
            sprite = new ƒAid.NodeSprite("Sprite");
            sprite.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
            sprite.setAnimation(<ƒAid.SpriteSheetAnimation>animations["ghosty"]);
            sprite.setFrameDirection(1);
            sprite.mtxLocal.translateZ(0.5);
            sprite.framerate = 3;
            this.addChild(sprite);
            this.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
        }


    }

    export async function ghostySetup(): Promise<void> {
        for (let i: number = 0; i < 4; i++) {
            let ghosty: Ghosty = new Ghosty(positionArr[i].x, positionArr[i].y, spritePositions[i]);
            graph.addChild(ghosty);
            ghostyGang.push(ghosty);
            ghosty.createSprite();
        }
    }
}