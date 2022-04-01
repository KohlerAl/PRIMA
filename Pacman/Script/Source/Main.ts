namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let dialog: HTMLDialogElement;

  let pacman: ƒ.Node;
  let speed: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);
  let graph: ƒ.Node;
  let chomp: ƒ.ComponentAudio;

  window.addEventListener("load", handleLoad);
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function handleLoad(_event: Event): void {
    console.log("Hello");
    dialog = document.querySelector("dialog");
    dialog.querySelector("h1").textContent = document.title;
    dialog.addEventListener("click", function (_event: Event): void {
      // @ts-ignore until HTMLDialog is implemented by all browsers and available in dom.d.ts
      dialog.close();
      startInteractiveViewport();
    });
    // @ts-ignore
    dialog.showModal();
  }

  async function startInteractiveViewport(): Promise<void> {
    await ƒ.Project.loadResourcesFromHTML();
    ƒ.Debug.log("Project:", ƒ.Project.resources);
    let graph: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-03-17T14:08:03.670Z|98238"];
    ƒ.Debug.log("Graph:", graph);
    if (!graph) {
      alert(
        "Nothing to render. Create a graph with at least a mesh, material and probably some light"
      );
      return;
    }
    let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
    let canvas: HTMLCanvasElement = document.querySelector("canvas");
    let viewport: ƒ.Viewport = new ƒ.Viewport();
    viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
    ƒ.Debug.log("Viewport:", viewport);

    viewport.draw();
    canvas.dispatchEvent(
      new CustomEvent("interactiveViewportStarted", {
        bubbles: true,
        detail: viewport
      })
    );
  }


  
  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    graph = viewport.getBranch();
    pacman = graph.getChildrenByName("Pacman")[0];

    viewport.camera.mtxPivot.translate(new ƒ.Vector3(2.5, 2.5, 15));
    viewport.camera.mtxPivot.rotateY(180);

    chomp = graph.getChildrenByName("Sound")[0].getComponents(ƒ.ComponentAudio)[1];
    //chomp = audioChomp.getComponent(ƒ.ComponentAudio);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used

    // Check if pacman is on the middle of the one tile if yes, he can walk in the direction of the pressed key
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]) && (pacman.mtxLocal.translation.y + 0.025) % 1 < 0.05)
      speed.set(1 / 60, 0, 0);

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]) && (pacman.mtxLocal.translation.y + 0.025) % 1 < 0.05)
      speed.set(- 1 / 60, 0, 0);

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W]) && (pacman.mtxLocal.translation.x + 0.025) % 1 < 0.05)
      speed.set(0, 1 / 60, 0);

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S]) && (pacman.mtxLocal.translation.x + 0.025) % 1 < 0.05)
      speed.set(0, -1 / 60, 0);

    checkDirection(speed);

    pacman.mtxLocal.translate(speed);
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function checkDirection(_speed: ƒ.Vector3): boolean {
    if (Math.sign(_speed.x) == 1) {
      if (!checkTile(Math.round(pacman.mtxLocal.translation.x + 0.515), Math.round(pacman.mtxLocal.translation.y))) {
        speed.set(0, speed.y, 0);
        return false;
      }
    }
    if (Math.sign(_speed.x) == -1) {
      if (!checkTile(Math.round(pacman.mtxLocal.translation.x - 0.515), Math.round(pacman.mtxLocal.translation.y))) {
        speed.set(0, speed.y, 0);
        return false;
      }
    }
    if (Math.sign(_speed.y) == 1) {
      if (!checkTile(Math.round(pacman.mtxLocal.translation.x), Math.round(pacman.mtxLocal.translation.y + 0.515))) {
        speed.set(speed.x, 0, 0);
        return false;
      }
    }
    if (Math.sign(_speed.y) == -1) {
      if (!checkTile(Math.round(pacman.mtxLocal.translation.x), Math.round(pacman.mtxLocal.translation.y - 0.515))) {
        speed.set(speed.x, 0, 0);
        return false;
      }
    }

    return true;
  }

  function checkTile(_x: number, _y: number): boolean {
    //get the row which pacman is about to enter (y-coordinate)
    let row: ƒ.Node = graph.getChildrenByName("Grid")[0].getChildren()[_y];
    if (row) {
      //get the tile via the x-coordinate
      let tile: ƒ.Node = row.getChild(_x);
      if (tile) {
        //get the color of the tile 
        let color: ƒ.Color = tile.getComponent(ƒ.ComponentMaterial).clrPrimary;
        //!!!! change here if color of walking tiles is changed !!!!
        if (+color.r.toFixed(2) == 0.18 && +color.g.toFixed(2) == 0.18 && +color.b.toFixed(2) == 0.18)
          return true;
      }
    }
    return false;
  }
}