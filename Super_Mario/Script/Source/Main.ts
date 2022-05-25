namespace Script {
  import ƒ = FudgeCore;
  import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let graph: ƒ.Node; 
  let mario: Mario; 

  export let animations: ƒAid.SpriteSheetAnimations;


  interface ExternalData {
    [name: string]: number; 
  }

  let config: ExternalData;
  let countdownTime: number;
  let numberCoins: number;
  let numberOpponents: number;

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    graph = viewport.getBranch();
    getExternalData(); 

    mario = new Mario(); 
    graph.appendChild(mario); 

    console.log(mario); 
    console.log(graph); 

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
    numberCoins = config["numCoins"]; 
    numberOpponents = config["numOpponents"]; 
  }
}