namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let dialog: HTMLDialogElement;

  let pacman: ƒ.Node;
  let speed: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);
  let oldSpeed: ƒ.Vector3 = new ƒ.Vector3(0, 0, 0);
  export let graph: ƒ.Node;
  let chomp: ƒ.ComponentAudio;

  let animations: ƒAid.SpriteSheetAnimations;
  let sprite: ƒAid.NodeSprite;



  window.addEventListener("load", handleLoad);
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function handleLoad(_event: Event): void {
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

    await loadSprites();

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

    viewport.camera.mtxPivot.translate(new ƒ.Vector3(4, 4, 15));
    viewport.camera.mtxPivot.rotateY(180);

    chomp = graph.getChildrenByName("Sound")[0].getComponents(ƒ.ComponentAudio)[1];
    oldSpeed.x = speed.x;
    oldSpeed.y = speed.y;

    ghostySetup();
    createSprite();

    ƒ.AudioManager.default.listenTo(graph);
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

    speed = checkDirection(speed);

    if (speed.x != 0 && !chomp.isPlaying || speed.y != 0 && !chomp.isPlaying)
      chomp.play(true);

    if (speed.x != oldSpeed.x || speed.y != oldSpeed.y)
      rotateSprite(speed);

    pacman.mtxLocal.translate(speed);

    for (let i: number = 0; i < ghostyGang.length; i++) {
      ghostyGang[i].checkPosition();
      ghostyGang[i].mtxLocal.translate(ghostyGang[i].speed);
    }

    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function checkDirection(_speed: ƒ.Vector3): ƒ.Vector3 {
    if (Math.sign(_speed.x) == 1) {
      if (!checkTile(Math.round(pacman.mtxLocal.translation.x + 0.515), Math.round(pacman.mtxLocal.translation.y)))
        _speed.set(0, _speed.y, 0);
    }

    if (Math.sign(_speed.x) == -1) {
      if (!checkTile(Math.round(pacman.mtxLocal.translation.x - 0.515), Math.round(pacman.mtxLocal.translation.y)))
        _speed.set(0, _speed.y, 0);
    }

    if (Math.sign(_speed.y) == 1) {
      if (!checkTile(Math.round(pacman.mtxLocal.translation.x), Math.round(pacman.mtxLocal.translation.y + 0.515)))
        _speed.set(_speed.x, 0, 0);
    }

    if (Math.sign(_speed.y) == -1) {
      if (!checkTile(Math.round(pacman.mtxLocal.translation.x), Math.round(pacman.mtxLocal.translation.y - 0.515)))
        _speed.set(_speed.x, 0, 0);
    }

    return _speed;
  }

  export function checkTile(_x: number, _y: number): boolean {
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

  function createSprite(): void {
    sprite = new ƒAid.NodeSprite("Sprite");
    sprite.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    sprite.setAnimation(<ƒAid.SpriteSheetAnimation>animations["pacman"]);
    sprite.setFrameDirection(1);
    sprite.mtxLocal.translateZ(0.5);
    sprite.framerate = 15;

    pacman.addChild(sprite);
    pacman.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
    sprite.mtxLocal.rotateZ(90);
  }

  async function loadSprites(): Promise<void> {
    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("Assets/texture.png");

    let spriteSheet: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);
    generateSprite(spriteSheet);
  }

  function generateSprite(_spritesheet: ƒ.CoatTextured): void {
    animations = {};
    let name: string = "pacman";

    let sprite: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation(name, _spritesheet);
    sprite.generateByGrid(ƒ.Rectangle.GET(0, 0, 64, 64), 8, 70, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(64));

    animations[name] = sprite;
  }

  function rotateSprite(_speed: ƒ.Vector3): void {
    if (_speed.x != 0 || _speed.y != 0) {
      let currentValue: number = sprite.mtxLocal.rotation.z;
      let rotateValue: number = 360 - currentValue;

      sprite.mtxLocal.rotateZ(rotateValue);

      if (Math.sign(_speed.x) == 1) {
        sprite.mtxLocal.rotateZ(0);
      }

      if (Math.sign(_speed.x) == -1) {
        sprite.mtxLocal.rotateZ(180);
      }

      if (Math.sign(_speed.y) == 1) {
        sprite.mtxLocal.rotateZ(90);
      }

      if (Math.sign(_speed.y) == -1) {
        sprite.mtxLocal.rotateZ(270);
      }


      oldSpeed.x = speed.x;
      oldSpeed.y = speed.y;
    }
  }


}