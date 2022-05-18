namespace Script {
    import ƒ = FudgeCore;
    import ƒUi = FudgeUserInterface;
  
    export class GameState extends ƒ.Mutable {
      public battery: number = 1;
      public exhaustion: number = 1;
  
      public constructor() {
        super();
        const domVui: HTMLDivElement = document.querySelector("div#vui");
        console.log("hello vui", new ƒUi.Controller(this, domVui));
      }
  
      protected reduceMutator(_mutator: ƒ.Mutator): void {}
    }
  }