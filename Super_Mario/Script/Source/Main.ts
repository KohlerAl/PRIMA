namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let graph: ƒ.Node;
  let mario: Mario;

  let gameState: GameState;

  export let animations: ƒAid.SpriteSheetAnimations;
  export let groundPositions: number[][] = []; 

  interface ExternalData {
    [name: string]: number;
  }

  let config: ExternalData;
  let countdownTime: number;
  let numberBoxes: number;
  let numberOpponents: number;
  let blockedNumbers: number[] = [22, 23, 24, 25, 26, 27, 34, 35, 36, 37, 47, 48, 49, 50];

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    graph = viewport.getBranch();
    getExternalData();
    getGroundParts(); 

    viewport.camera.projectCentral(5, 2);
    /* viewport.camera.mtxPivot.translateZ(-455);
    viewport.camera.mtxPivot.translateY(4.5);
    viewport.camera.mtxPivot.translateX(-11.5); */

    viewport.camera.mtxPivot.translate(new ƒ.Vector3(6, 5, 0));
    viewport.camera.mtxPivot.rotateY(180);
    viewport.camera.mtxPivot.translateZ(-400);


    mario = new Mario();
    graph.appendChild(mario);

    let goomba: Goomba = new Goomba();
    graph.appendChild(goomba);


    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    mario.walk();
    mario.jump();
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

      groundPositions.push([translateGround - scaleGround / 2, translateGround + scaleGround / 2]); 
    }

    console.log(groundPositions); 
  }

  function createRandomNumber(_min: number, _max: number): number {
    return Math.floor(Math.random() * (_max - _min + 1)) + _min;
  }
}