namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let pacman: ƒ.Node;
  let speed: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);
  let graph: ƒ.Node;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    graph = viewport.getBranch();
    pacman = graph.getChildrenByName("Pacman")[0];

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used

    // Check if pacman is on the middle of the one tile if yes, he can walk in the direction of the pressed key
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT, ƒ.KEYBOARD_CODE.D]) && (pacman.mtxLocal.translation.y + 0.025) % 1 < 0.05) {
      let x: number = Math.round(pacman.mtxLocal.translation.x + 0.515);
      let y: number = Math.round(pacman.mtxLocal.translation.y);
      if (checkTile(x, y) == true) {
        speed.set(1 / 60, 0, 0);
      }
      else {
        speed.set(0, speed.y, 0);
      }
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT, ƒ.KEYBOARD_CODE.A]) && (pacman.mtxLocal.translation.y + 0.025) % 1 < 0.05) {
      let x: number = Math.round(pacman.mtxLocal.translation.x - 0.515);
      let y: number = Math.round(pacman.mtxLocal.translation.y);
      if (checkTile(x, y) == true) {
        speed.set(- 1 / 60, 0, 0);
      }
      else {
        speed.set(0, speed.y, 0);
      }
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.W]) && (pacman.mtxLocal.translation.x + 0.025) % 1 < 0.05) {
      let x: number = Math.round(pacman.mtxLocal.translation.x);
      let y: number = Math.round(pacman.mtxLocal.translation.y + 0.515);
      if (checkTile(x, y) == true) {
        speed.set(0, 1 / 60, 0);
      }
      else {
        speed.set(speed.x, 0, 0);
      }
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_DOWN, ƒ.KEYBOARD_CODE.S]) && (pacman.mtxLocal.translation.x + 0.025) % 1 < 0.05) {
      let x: number = Math.round(pacman.mtxLocal.translation.x);
      let y: number = Math.round(pacman.mtxLocal.translation.y - 0.515);
      if (checkTile(x, y) == true) {
        speed.set(0, -1 / 60, 0);
      }
      else {
        speed.set(speed.x, 0, 0);
      }
    }


    pacman.mtxLocal.translate(speed);
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function checkTile(_x: number, _y: number): boolean {
    //get the Grid as parent of all rows
    let parent: ƒ.Node = graph.getChildrenByName("Grid")[0];


    //get the row which pacman is about to enter (y-coordinate)
    let row: ƒ.Node = parent.getChildren()[_y];

    if (row) {
      //get the tile via the x-coordinate
      let tile: ƒ.Node = row.getChild(_x);

      if (tile) {
        //get the material and the color of the tile 
        let material: ƒ.ComponentMaterial = tile.getComponent(ƒ.ComponentMaterial);
        let color: ƒ.Color = material.clrPrimary;

        let colorR: number = +color.r.toFixed(2);
        let colorG: number = +color.g.toFixed(2);
        let colorB: number = +color.b.toFixed(2);

        //!!!! change here if color of walking tiles is changed !!!!
        if (colorR == 0.18 && colorG == 0.18 && colorB == 0.18) {
          return true;
        }
      }
    }
    return false;
  }
}