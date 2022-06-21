namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  export let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  export let graph: ƒ.Node;
  export let mario: Mario;
  export let goombas: Goomba[] = [];

  export let gameState: GameState;
  export let numberPointsGoomba: number = 1000;

  export let animations: ƒAid.SpriteSheetAnimations;
  export let groundPositions: number[][] = [];
  export let blockedPositions: number[];

  interface ExternalData {
    [name: string]: number;
  }

  let time: ƒ.Time;
  export let timer: ƒ.Timer;

  let config: ExternalData;
  let countdownTime: number;
  let numberBoxes: number;
  let numberOpponents: number;
  export let blockedNumbers: number[] = [12, 13, 14, 15, 22, 23, 24, 25, 26, 27, 28, 29, 33, 34, 35, 36, 37, 45, 46, 47, 48, 49, 50, 53, 54, 55, 73, 74, 75, 76, 77, 78, 79, 89, 90, 91];

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    graph = viewport.getBranch();
    await getExternalData();
    getGroundParts();

    mario = new Mario();
    graph.appendChild(mario);
    mario.addComponent(createCamera());
    //createCamera();

    for (let i: number = 0; i < 1; i++) {
      goombas.push(new Goomba());
      graph.appendChild(goombas[i]);
    }

    time = new ƒ.Time();
    timer = new ƒ.Timer(time, 1000, 0, updateTimer);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  export function update(_event: Event): void {
    mario.update();
    if (goombas.length > 0) {
      for (let goomba of goombas)
        goomba.update();
    }

    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    //ƒ.AudioManager.default.update();
  }

  async function getExternalData(): Promise<void> {
    let response: Response = await fetch("config.json");
    config = await response.json();
    countdownTime = config["countdown"];
    numberBoxes = config["numBoxes"];
    numberOpponents = config["numOpponents"];
    console.log(numberOpponents);

    gameState = new GameState(countdownTime);
    console.log(gameState);

    let boxParent: ƒ.Node = graph.getChildrenByName("Environment")[0].getChildrenByName("Boxes")[0];
    //let environment: ƒ.Node = graph.getChildrenByName("Environment")[0].getChildrenByName("GroundParts")[0];

    for (let i: number = 0; i < numberBoxes; i++) {
      let item: Item;
      let randomPosX: number = createRandomNumber(5, 68);

      for (let i: number = 0; i < blockedNumbers.length; i++) {
        if (randomPosX == blockedNumbers[i]) {
          randomPosX -= 5;
        }
      }

      if (createRandomNumber(0, 1) == 1)
        item = new Item("powerUpBox", "powerUpBox", randomPosX);
      else
        item = new Item("itemBox", "box", randomPosX);

      boxParent.appendChild(item);

    }
  }

  function getGroundParts(): void {
    let groundParts: ƒ.Node[] = graph.getChildrenByName("Environment")[0].getChildrenByName("GroundParts")[0].getChildren();

    for (let groundPart of groundParts) {
      let translateGround: number = groundPart.mtxLocal.translation.x;
      let scaleGround: number = groundPart.mtxLocal.scaling.x;

      groundPositions.push([(translateGround - scaleGround / 2) + 1, (translateGround + scaleGround / 2) - 1]);
    }
  }

  function updateTimer(): void {
    gameState.timer -= 1;

    if (gameState.timer <= 0) {
      ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, update);
    }
  }

  function createCamera(): ƒ.ComponentCamera {
    let newCam: ƒ.ComponentCamera = new ƒ.ComponentCamera();
    //newCam.projectOrthographic(); 
    viewport.camera = newCam;
    viewport.camera.projectCentral(canvas.clientWidth / canvas.clientHeight, 5);
    //viewport.camera.mtxPivot.translate(new ƒ.Vector3(0, 0, 0));
    viewport.camera.mtxPivot.rotateY(180);
    viewport.camera.mtxPivot.translateZ(-450);

    viewport.camera.mtxPivot.scale(new ƒ.Vector3(2, 1, 2));

    return newCam;
  }

  export function createRandomNumber(_min: number, _max: number): number {
    return Math.floor(Math.random() * (_max - _min + 1)) + _min;
  }

  export function createRandomDirection(): string {
    let randomNmbr: number = createRandomNumber(0, 1);
    if (randomNmbr == 0) {
      return "left";
    }
    else {
      return "right";
    }
  }

  export function isBetween(_x: number, _min: number, _max: number): boolean {
    if (_x >= _min && _x <= _max)
      return true;

    else
      return false;
  }
}