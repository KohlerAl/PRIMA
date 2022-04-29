namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);

  export class Slenderman extends ƒ.ComponentScript {
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(Slenderman);
    public change: number = 0;
    public target: ƒ.Vector3 = new ƒ.Vector3();
    public position: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);

    constructor() {
      super();
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      //
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
    }

    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.walkSlendi);
          //this.node.mtxLocal.translate(this.position);
          break;
      }
    }

    public walkSlendi = (_event: Event): void => {

      this.position.add(ƒ.Vector3.SCALE(this.target, ƒ.Loop.timeFrameGame / 1000));

      if (this.position.x > -30 && this.position.x < 30 && this.position.y > -30 && this.position.y < 30)
        this.node.mtxLocal.translate(ƒ.Vector3.SCALE(this.target, ƒ.Loop.timeFrameGame / 1000));

      if (this.change > ƒ.Time.game.get())
        return;

      this.change = ƒ.Time.game.get() + 1000;

      this.target = ƒ.Random.default.getVector3(new ƒ.Vector3(-1, 0, -1), new ƒ.Vector3(1, 0, 1));
    }
  }
}