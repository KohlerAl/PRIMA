namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  enum JOB {
    STALK, STARE
  }

  ƒ.Project.registerScriptNamespace(Script);

  export class Slenderman extends ƒAid.ComponentStateMachine<JOB> {
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(Slenderman);
    private static instructions: ƒAid.StateMachineInstructions<JOB> = Slenderman.get();
    public change: number = 0;
    public target: ƒ.Vector3 = new ƒ.Vector3();
    public position: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);
    private cmpBody: ƒ.ComponentRigidbody;

    constructor() {
      super();
      this.instructions = Slenderman.instructions;

      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      console.log("hello slendi");
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

    public static get(): ƒAid.StateMachineInstructions<JOB> {
      let setup: ƒAid.StateMachineInstructions<JOB> = new ƒAid.StateMachineInstructions();
      setup.transitDefault = Slenderman.transitDefault;
      setup.actDefault = Slenderman.actDefault;
      setup.setAction(JOB.STALK, <ƒ.General>this.actStalk);
      setup.setAction(JOB.STARE, <ƒ.General>this.actStare);

      return setup;
    }

    private static transitDefault(_machine: Slenderman): void {
      console.log("Transit to", _machine.stateNext);
    }

    private static async actDefault(_machine: Slenderman): Promise<void> {
      console.log(JOB[_machine.stateCurrent]);
      let graph: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-04-14T13:06:10.990Z|08163"];
      let ground: ƒ.Node = graph.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0];
      let cmpMeshGround: ƒ.ComponentMesh = ground.getComponent(ƒ.ComponentMesh);
      let meshTerrain: ƒ.MeshTerrain = <ƒ.MeshTerrain>cmpMeshGround.mesh;

      let terrainInfo: ƒ.TerrainInfo = meshTerrain.getTerrainInfo(_machine.node.mtxLocal.translation, cmpMeshGround.mtxWorld);
      if (terrainInfo.distance < 0.5)
        _machine.cmpBody.applyForce(ƒ.Vector3.Y(20));
    }

    private static actStalk(_machine: Slenderman): void {
      console.log("Slendi stalk");

      /* if (rigidAvatar) {

        _machine.node.mtxLocal.translate(
          ƒ.Vector3.SCALE(ƒ.Vector3.Z(), ƒ.Loop.timeFrameGame / 1000)
        ); */
      //_machine.node.mtxLocal.lookAt(rigidAvatar.mtxLocal.translation, ƒ.Vector3.Y(), true);
      //}
    }

    private static actStare(): void {
      console.log("Slendi stare");
    }

    private hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
          this.transit(JOB.STALK);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          this.cmpBody = this.node.getComponent(ƒ.ComponentRigidbody);
          this.cmpBody.addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_ENTER, (_event: ƒ.EventPhysics) => {
            if (_event.cmpRigidbody.node.name == "Avatar") { this.transit(JOB.STARE); console.log("stare stare"); };
          });
          this.cmpBody.addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_EXIT, (_event: ƒ.EventPhysics) => {
            if (this.stateCurrent == JOB.STARE)
              this.transit(JOB.STALK);
          });
          break;
      }
    }


    private update = (_event: Event): void => {
      this.act();
    }

    /* public walkSlendi = (_event: Event): void => {
  
      this.position.add(ƒ.Vector3.SCALE(this.target, ƒ.Loop.timeFrameGame / 1000));
  
      if (this.position.x > -30 && this.position.x < 30 && this.position.y > -30 && this.position.y < 30)
        this.node.mtxLocal.translate(ƒ.Vector3.SCALE(this.target, ƒ.Loop.timeFrameGame / 1000));
  
      if (this.change > ƒ.Time.game.get())
        return;
  
      this.change = ƒ.Time.game.get() + 1000;
  
      this.target = ƒ.Random.default.getVector3(new ƒ.Vector3(-1, 0, -1), new ƒ.Vector3(1, 0, 1));
    } */
  }
}