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
        }

        public createPosition(_rangeStart: number, _rangeEnd: number): number {

            let rand: number | null = null;

            while (rand === null || blockedNumbers.includes(rand)) {
                rand = Math.round(Math.random() * (createRandomNumber(_rangeStart, _rangeEnd))); 
            }
            return rand;
        }
    }
}