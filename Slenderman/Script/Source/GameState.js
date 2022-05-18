"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒUi = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        battery = 1;
        exhaustion = 1;
        constructor() {
            super();
            const domVui = document.querySelector("div#vui");
            console.log("hello vui", new ƒUi.Controller(this, domVui));
        }
        reduceMutator(_mutator) { }
    }
    Script.GameState = GameState;
})(Script || (Script = {}));
//# sourceMappingURL=GameState.js.map