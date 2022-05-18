namespace Script {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class DropToGroundInitial extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(DropToGroundInitial);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public graph: ƒ.Node;
    public ground: ƒ.Node;
    public cmpMeshGround: ƒ.ComponentMesh;
    public meshTerrain: ƒ.MeshTerrain;

    constructor() {
      super();
      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      //render-event und dann beim ersten aufruf der funktion den listener löschen 
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.addComponent);
    }

    public addComponent = (_event: Event): void => {
      this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.setHeight);
    }

    public setHeight = (_event: Event): void => {
      this.graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-04-14T13:06:10.990Z|08163"];
      this.ground = this.graph.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0];
      this.cmpMeshGround = this.ground.getComponent(ƒ.ComponentMesh);
      this.meshTerrain = <ƒ.MeshTerrain>this.cmpMeshGround.mesh;

      /* console.log(this.meshTerrain) */
      if (this.meshTerrain) {

        let distance: number = this.meshTerrain.getTerrainInfo(this.node.mtxLocal.translation, this.cmpMeshGround.mtxWorld).distance;
        /* console.log(distance) */
        if (distance)
          this.node.mtxLocal.translateY(-distance);
      }
      //this.node.removeEventListener(ƒ.EVENT.RENDER_PREPARE, this.setHeight);
    }
  }
}