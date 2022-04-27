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

      document.addEventListener("interactiveViewportStarted", <EventListener>this.setHeight);
    }

    public setHeight = (_event: Event): void => {
      //find the terrain mesh 
      this.graph = viewport.getBranch();
      this.ground = this.graph.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0];
      this.cmpMeshGround = this.ground.getComponent(ƒ.ComponentMesh);
      this.meshTerrain = <ƒ.MeshTerrain>this.cmpMeshGround.mesh;
      this.node.mtxLocal.translateY(5);

      let distance: number = this.meshTerrain.getTerrainInfo(this.node.mtxLocal.translation, this.cmpMeshGround.mtxWorld).distance;
      if (Math.sign(distance) == 1)
        this.node.mtxLocal.translateY(-distance);

      else if (Math.sign(distance) == -1 || Math.sign(distance) == 0)
        this.node.mtxLocal.translateY(distance); 
    }
  }
}