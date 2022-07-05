namespace Script {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

    export class SetPosition extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        public message: string = "CustomComponentScript added to ";


        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.createPosition);
        }


        public createPosition(): void {
            let randomPos: number = createRandomNumber(5, tileNumbers.length); 
            this.node.mtxLocal.translateX(tileNumbers[randomPos]); 
            console.log(tileNumbers[randomPos]); 
            console.log( this.node.mtxLocal.translation.x)
            tileNumbers.splice(randomPos, 1); 
        }
    }
}