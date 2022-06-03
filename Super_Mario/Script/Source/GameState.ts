namespace Script {
  import ƒ = FudgeCore;
  import ƒUi = FudgeUserInterface;

  export class GameState extends ƒ.Mutable {
    public timer: number; 
    public points: number = 0;

    public constructor(_timer: number) {
      super();
      const domVui: HTMLDivElement = document.querySelector("div#vui");
      console.log("hello vui", new ƒUi.Controller(this, domVui));
      this.timer = _timer; 
    }

    protected reduceMutator(_mutator: ƒ.Mutator): void {// 
    }
  }
}