namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  export let viewport: ƒ.Viewport;
  let avatar: ƒ.Node;
  let cmpCamera: ƒ.ComponentCamera;
  //let speedRotY: number = -0.2;
  let speedRotX: number = 0.2;
  let rotationX: number = 0;
  let cntWalk: ƒ.Control = new ƒ.Control("cntWalk", 2, ƒ.CONTROL_TYPE.PROPORTIONAL);
  let exhaustion: number = 0;
  let canSprint: boolean = true;
  export let rigidAvatar: ƒ.ComponentRigidbody;
  let gameState: GameState;

  let config: Object;

  let numTrees: number = 15;
  export let treePositions: ƒ.Vector3[] = [];
  let treeTypes: string[] = ["Graph|2022-04-26T14:47:00.339Z|52413", "Graph|2022-04-29T19:03:07.678Z|58333"];

  let numStones: number = 0;

  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;

    //get Avatar and Camera to walk and look around
    avatar = viewport.getBranch().getChildrenByName("Avatar")[0];
    rigidAvatar = avatar.getComponent(ƒ.ComponentRigidbody);
    viewport.camera = cmpCamera = avatar.getChild(0).getComponent(ƒ.ComponentCamera);

    gameState = new GameState();

    let response: Response = await fetch("config.json");
    config = await response.json();
    console.log(config);

    let canvas: HTMLCanvasElement = <HTMLCanvasElement>document.querySelector("canvas");
    canvas.requestPointerLock();
    canvas.addEventListener("pointermove", hndPointerMove);

    createTrees();
    createStones();

    animation(); 

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    ƒ.Physics.simulate();  // if physics is included and used
    controlWalk();
    controlSpeed();
    viewport.draw();

    gameState.battery -= 0.001;
    ƒ.AudioManager.default.update();
  }

  function controlWalk(): void {
    let input: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP], [ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]);

    cntWalk.setInput(input);
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT]) && canSprint == true)
      cntWalk.setFactor(8);
    else
      cntWalk.setFactor(2);

    let strafe: number = ƒ.Keyboard.mapToTrit([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT], [ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]);
    let vector: ƒ.Vector3 = new ƒ.Vector3((1.5 * strafe * ƒ.Loop.timeFrameGame) / 10, 0, (cntWalk.getOutput() * ƒ.Loop.timeFrameGame / 10));

    vector.transform(avatar.mtxLocal, false);
    rigidAvatar.setVelocity(vector);
  }

  function hndPointerMove(_event: PointerEvent): void {
    //avatar.mtxLocal.rotateY(_event.movementX * speedRotY);

    /* let vector: ƒ.Vector3 = new ƒ.Vector3(0, _event.movementX * speedRotY, 0);
    vector.transform(avatar.mtxLocal, false);  
    rigidAvatar.setRotation(vector);  */


    rotationX += _event.movementY * speedRotX;
    rotationX = Math.min(60, Math.max(-60, rotationX));
    cmpCamera.mtxPivot.rotation = ƒ.Vector3.X(rotationX);
  }

  function controlSpeed(): void {
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT]) && canSprint == true) {
      exhaustion += ƒ.Loop.timeFrameGame / 1000;
      gameState.exhaustion += ƒ.Loop.timeFrameGame / 1000;
      console.log(gameState.exhaustion);
      if (exhaustion > 4) {
        canSprint = false;

        setTimeout(
          function (): void {
            canSprint = true;
            exhaustion = 0;
            gameState.exhaustion = 0;
          },
          7000);
      }
    }
  }

  function createTrees(): void {
    let parentTrees: ƒ.Node = viewport.getBranch().getChildrenByName("Environment")[0].getChildrenByName("Trees")[0];

    for (let i: number = 0; i < numTrees; i++) {
      let type: string = treeTypes[Math.floor(Math.random() * treeTypes.length)];
      let tree: Tree = new Tree(type);
      treePositions.push(tree.position);
      parentTrees.addChild(tree);
    }
  }

  function createStones(): void {
    let parentStones: ƒ.Node = viewport.getBranch().getChildrenByName("Environment")[0].getChildrenByName("Stones")[0];

    for (let i: number = 0; i < numStones; i++) {
      let stone: Stone = new Stone();
      parentStones.addChild(stone);
    }
  }

  function animation(): void {
    let animseq: ƒ.AnimationSequence = new ƒ.AnimationSequence();
    animseq.addKey(new ƒ.AnimationKey(0, 1));
    animseq.addKey(new ƒ.AnimationKey(750, 4));
    animseq.addKey(new ƒ.AnimationKey(1500, 1));


    let animStructure: ƒ.AnimationStructure = {
      components: {
        ComponentTransform: [
          {
            "ƒ.ComponentTransform": {
              mtxLocal: {
                rotation: {
                  x: animseq,
                  y: animseq
                }
              }
            }
          }
        ]
      }
    };

    let animation: ƒ.Animation = new ƒ.Animation("testAnimation", animStructure, 60);

    let cmpAnimator: ƒ.ComponentAnimator = new ƒ.ComponentAnimator(animation);
    cmpAnimator.scale = 1;

    let parentTrees: ƒ.Node = viewport.getBranch().getChildrenByName("Environment")[0].getChildrenByName("Trees")[0];
    let tree: ƒ.Node = parentTrees.getChildrenByName("Tree")[0];

    if (tree.getComponent(ƒ.ComponentAnimator)) {
      tree.removeComponent(tree.getComponent(ƒ.ComponentAnimator));
    }
    tree.addComponent(cmpAnimator);
    cmpAnimator.activate(true);

    console.log("Component", cmpAnimator);

  }
}