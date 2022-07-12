namespace Script {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export async function setupSprite(_name: string, _position: number[], _frames: number, _offset: number): Promise<ƒAid.NodeSprite> {
        let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
        await imgSpriteSheet.load("Sprites/sprites.png");

        let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

        let animation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation(_name, coat);
        animation.generateByGrid(ƒ.Rectangle.GET(_position[0], _position[1], _position[2], _position[3]), _frames, 70, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(_offset));
        let sprite: ƒAid.NodeSprite = new ƒAid.NodeSprite("Sprite");
        sprite.setAnimation(animation);
        sprite.setFrameDirection(1);
        sprite.framerate = 6;

        let cmpTransfrom: ƒ.ComponentTransform = new ƒ.ComponentTransform();
        sprite.addComponent(cmpTransfrom);
        return sprite; 
    }

    export async function changeImage(): Promise<void> {
        //change Sprite Image
    }
}