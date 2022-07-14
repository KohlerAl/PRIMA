namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;

  export let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  export let graph: ƒ.Node;
  export let mario: Mario;
  export let camNode: ƒ.Node;
  export let goombas: Goomba[] = [];
  export let goombaParent: ƒ.Node;

  export let gameState: GameState;
  export let numberPointsGoomba: number = 1000;

  export let animations: ƒAid.SpriteSheetAnimations;

  let deathSound: ƒ.ComponentAudio; 

  interface ExternalData {
    [name: string]: number;
  }

  let time: ƒ.Time;
  export let timer: ƒ.Timer;

  let config: ExternalData;
  let countdownTime: number;
  let numberBoxes: number;
  let numberOpponents: number;
  export let tileNumbers: number[] = [];

  async function start(_event: CustomEvent): Promise<void> {
    //get viewport and graph
    viewport = _event.detail;
    graph = viewport.getBranch();

    //get positions from ground parts, get external data and create Boxes
    getGroundParts();
    await getExternalData();
    createBoxes();

    //create Mario
    mario = new Mario();
    let marioParent: ƒ.Node = graph.getChildrenByName("Avatar")[0];
    marioParent.appendChild(mario);
    setUpCam();

    //create opponents
    for (let i: number = 0; i < numberOpponents; i++) {
      goombas.push(new Goomba());
      goombaParent = graph.getChildrenByName("Opponents")[0];
      goombaParent.appendChild(goombas[i]);
    }

    //start timer
    time = new ƒ.Time();
    timer = new ƒ.Timer(time, 1000, 0, updateTimer);
    ƒ.AudioManager.default.listenTo(graph);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  export function update(_event: Event): void {
    mario.update();

    for (let goomba of goombas)
      goomba.update();


    ƒ.Physics.simulate();
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  async function getExternalData(): Promise<void> {
    let response: Response = await fetch("config.json");
    config = await response.json();
    countdownTime = config["countdown"];
    numberBoxes = config["numBoxes"];
    numberOpponents = config["numOpponents"];

    gameState = new GameState(countdownTime);
  }

  function getGroundParts(): void {
    let groundParts: ƒ.Node[] = graph.getChildrenByName("Environment")[0].getChildrenByName("Ground")[0].getChildren();

    for (let groundPart of groundParts) {
      let groundPiece: ƒ.Node[] = groundPart.getChildren();

      for (let ground of groundPiece) {
        tileNumbers.push(ground.mtxLocal.translation.x);

      }
    }

    /* let obstacles: ƒ.Node = graph.getChildrenByName("Environment")[0].getChildrenByName("Obstacles")[0];
    let pieces: ƒ.Node[] = obstacles.getChildren();

    for (let obstacleParent of pieces) {
      let singleObstacle: ƒ.Node[] = obstacleParent.getChildren();

      for (let obstacle of singleObstacle) {
        if (tileNumbers.includes(Math.floor(obstacle.mtxLocal.translation.x))) {
          let index: number = tileNumbers.indexOf(obstacle.mtxLocal.translation.x);
          tileNumbers.splice(index, 1);
        }
      }
    } */
  }

  function createBoxes(): void {
    let boxParent: ƒ.Node = graph.getChildrenByName("Environment")[0].getChildrenByName("Boxes")[0];

    for (let i: number = 0; i < numberBoxes; i++) {
      let item: Item;

      if (createRandomNumber(0, 1) == 1)
        item = new Item("powerUpBox", "powerUpBox");
      else
        item = new Item("itemBox", "box");

      boxParent.appendChild(item);

    }
  }

  function updateTimer(): void {
    gameState.timer -= 1;

    if (gameState.timer <= 0) {
      ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, update);
    }
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