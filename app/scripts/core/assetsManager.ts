import { Assets, BaseTexture, Cache, Container, Matrix, 
  Rectangle, RenderTexture, SCALE_MODES, Sprite, Texture } from "pixi.js"
import GameCoordinator from "./gameCoordinator.ts";
class AssetsManager {       
    gameCoordinator:GameCoordinator
    textures:Map<String,Texture> 
    constructor(gameCoordinator:GameCoordinator) {
        this.gameCoordinator = gameCoordinator
        this.textures = new Map()
    }
  async load():Promise<void> {
        const imgBase = 'app/style/graphics/spriteSheets/';        
        Assets.add({alias:"maze_blue",src:`${imgBase}maze/maze_blue.svg`})        
        Assets.add({alias:"maze_white",src:`${imgBase}maze/maze_white.svg`})        
        
      // Pacman
        Assets.add({alias:"arrow_down",src:`${imgBase}characters/pacman/arrow_down.svg`})        
        Assets.add({alias:"arrow_left",src:`${imgBase}characters/pacman/arrow_left.svg`})
        Assets.add({alias:"arrow_right",src:`${imgBase}characters/pacman/arrow_right.svg`})
        Assets.add({alias:"arrow_up",src:`${imgBase}characters/pacman/arrow_up.svg`})
        Assets.add({alias:"pacman_death",src:`${imgBase}characters/pacman/pacman_death.svg`})
        Assets.add({alias:"pacman_error",src:`${imgBase}characters/pacman/pacman_error.svg`})
        Assets.add({alias:"pacman_down",src:`${imgBase}characters/pacman/pacman_down.svg`})
        Assets.add({alias:"pacman_left",src:`${imgBase}characters/pacman/pacman_left.svg`})
        Assets.add({alias:"pacman_right",src:`${imgBase}characters/pacman/pacman_right.svg`})
        Assets.add({alias:"pacman_up",src:`${imgBase}characters/pacman/pacman_up.svg`})

        // Blinky
        Assets.add({alias:"blinky_down_angry",src:`${imgBase}characters/ghosts/blinky/blinky_down_angry.svg`})
        Assets.add({alias:"blinky_down_annoyed",src:`${imgBase}characters/ghosts/blinky/blinky_down_annoyed.svg`})
        Assets.add({alias:"blinky_down",src:`${imgBase}characters/ghosts/blinky/blinky_down.svg`})
        Assets.add({alias:"blinky_left_angry",src:`${imgBase}characters/ghosts/blinky/blinky_left_angry.svg`})
        Assets.add({alias:"blinky_left_annoyed",src:`${imgBase}characters/ghosts/blinky/blinky_left_annoyed.svg`})
        Assets.add({alias:"blinky_left",src:`${imgBase}characters/ghosts/blinky/blinky_left.svg`})
        Assets.add({alias:"blinky_right_angry",src:`${imgBase}characters/ghosts/blinky/blinky_right_angry.svg`})
        Assets.add({alias:"blinky_right_annoyed",src:`${imgBase}characters/ghosts/blinky/blinky_right_annoyed.svg`})
        Assets.add({alias:"blinky_right",src:`${imgBase}characters/ghosts/blinky/blinky_right.svg`})
        Assets.add({alias:"blinky_up_angry",src:`${imgBase}characters/ghosts/blinky/blinky_up_angry.svg`})
        Assets.add({alias:"blinky_up_annoyed",src:`${imgBase}characters/ghosts/blinky/blinky_up_annoyed.svg`})
        Assets.add({alias:"blinky_up",src:`${imgBase}characters/ghosts/blinky/blinky_up.svg`})

        // Clyde
        Assets.add({alias:"clyde_down",src:`${imgBase}characters/ghosts/clyde/clyde_down.svg`})
        Assets.add({alias:"clyde_left",src:`${imgBase}characters/ghosts/clyde/clyde_left.svg`})
        Assets.add({alias:"clyde_right",src:`${imgBase}characters/ghosts/clyde/clyde_right.svg`})
        Assets.add({alias:"clyde_up",src:`${imgBase}characters/ghosts/clyde/clyde_up.svg`})

        // Inky
        Assets.add({alias:"inky_down",src:`${imgBase}characters/ghosts/inky/inky_down.svg`})
        Assets.add({alias:"inky_left",src:`${imgBase}characters/ghosts/inky/inky_left.svg`})
        Assets.add({alias:"inky_right",src:`${imgBase}characters/ghosts/inky/inky_right.svg`})
        Assets.add({alias:"inky_up",src:`${imgBase}characters/ghosts/inky/inky_up.svg`})

        // Pinky
        Assets.add({alias:"pinky_down",src:`${imgBase}characters/ghosts/pinky/pinky_down.svg`})
        Assets.add({alias:"pinky_left",src:`${imgBase}characters/ghosts/pinky/pinky_left.svg`})
        Assets.add({alias:"pinky_right",src:`${imgBase}characters/ghosts/pinky/pinky_right.svg`})
        Assets.add({alias:"pinky_up",src:`${imgBase}characters/ghosts/pinky/pinky_up.svg`})

        // Ghosts Common
        Assets.add({alias:"eyes_down",src:`${imgBase}characters/ghosts/eyes_down.svg`})
        Assets.add({alias:"eyes_left",src:`${imgBase}characters/ghosts/eyes_left.svg`})
        Assets.add({alias:"eyes_right",src:`${imgBase}characters/ghosts/eyes_right.svg`})
        Assets.add({alias:"eyes_up",src:`${imgBase}characters/ghosts/eyes_up.svg`})
        Assets.add({alias:"scared_blue",src:`${imgBase}characters/ghosts/scared_blue.svg`})
        Assets.add({alias:"scared_white",src:`${imgBase}characters/ghosts/scared_white.svg`})

        // Dots
        Assets.add({alias:"pacdot",src:`${imgBase}pickups/pacdot.svg`})
        Assets.add({alias:"powerPellet",src:`${imgBase}pickups/powerPellet.svg`})

        // Fruit
        Assets.add({alias:"apple",src:`${imgBase}pickups/apple.svg`})
        Assets.add({alias:"bell",src:`${imgBase}pickups/bell.svg`})
        Assets.add({alias:"cherry",src:`${imgBase}pickups/cherry.svg`})
        Assets.add({alias:"galaxian",src:`${imgBase}pickups/galaxian.svg`})
        Assets.add({alias:"key",src:`${imgBase}pickups/key.svg`})
        Assets.add({alias:"melon",src:`${imgBase}pickups/melon.svg`})
        Assets.add({alias:"orange",src:`${imgBase}pickups/orange.svg`})
        Assets.add({alias:"strawberry",src:`${imgBase}pickups/strawberry.svg`})

        // Text
        Assets.add({alias:"ready",src:`${imgBase}text/ready.svg`})
        Assets.add({alias:"game_over",src:`${imgBase}text/game_over.svg`}) 

        // Points
        Assets.add({alias:"100",src:`${imgBase}text/100.svg`})
        Assets.add({alias:"200",src:`${imgBase}text/200.svg`})
        Assets.add({alias:"300",src:`${imgBase}text/300.svg`})
        Assets.add({alias:"400",src:`${imgBase}text/400.svg`})
        Assets.add({alias:"500",src:`${imgBase}text/500.svg`})
        Assets.add({alias:"700",src:`${imgBase}text/700.svg`})
        Assets.add({alias:"800",src:`${imgBase}text/800.svg`})
        Assets.add({alias:"1000",src:`${imgBase}text/1000.svg`})
        Assets.add({alias:"1600",src:`${imgBase}text/1600.svg`})
        Assets.add({alias:"2000",src:`${imgBase}text/2000.svg`})
        Assets.add({alias:"3000",src:`${imgBase}text/3000.svg`})
        Assets.add({alias:"5000",src:`${imgBase}text/5000.svg`})

        // Misc
       Assets.add({alias:"extra_life",src: 'app/style/graphics/extra_life.png'})
       
  const imageAliases = [
    "maze_blue",
    "maze_white",
    "arrow_down",
    "arrow_left",
    "arrow_right",
    "arrow_up",
    "pacman_death",
    "pacman_error",
    "pacman_down",
    "pacman_left",
    "pacman_right",
    "pacman_up",
    "blinky_down_angry",
    "blinky_down_annoyed",
    "blinky_down",
    "blinky_left_angry",
    "blinky_left_annoyed",
    "blinky_left",
    "blinky_right_angry",
    "blinky_right_annoyed",
    "blinky_right",
    "blinky_up_angry",
    "blinky_up_annoyed",
    "blinky_up",
    "clyde_down",
    "clyde_left",
    "clyde_right",
    "clyde_up",
    "inky_down",
    "inky_left",
    "inky_right",
    "inky_up",
    "pinky_down",
    "pinky_left",
    "pinky_right",
    "pinky_up",
    "eyes_down",
    "eyes_left",
    "eyes_right",
    "eyes_up",
    "scared_blue",
    "scared_white",
    "pacdot",
    "powerPellet",
    "apple",
    "bell",
    "cherry",
    "galaxian",
    "key",
    "melon",
    "orange",
    "strawberry",
    "ready",
    "game_over",
    "100",
    "200",
    "300",
    "400",
    "500",
    "700",
    "800",
    "1000",
    "1600",
    "2000",
    "3000",
    "5000",    
    "extra_life"]

    const audioBase = 'app/style/audio/';
    const audioSources = [
        `${audioBase}game_start.mp3`,
        `${audioBase}pause.mp3`,
        `${audioBase}pause_beat.mp3`, 
        `${audioBase}siren_1.mp3`,
        `${audioBase}siren_2.mp3`,
        `${audioBase}siren_3.mp3`,
        `${audioBase}power_up.mp3`,
        `${audioBase}extra_life.mp3`,
        `${audioBase}eyes.mp3`,
        `${audioBase}eat_ghost.mp3`,
        `${audioBase}death.mp3`, 
        `${audioBase}fruit.mp3`,
        `${audioBase}dot_1.mp3`,
        `${audioBase}dot_2.mp3`,
    ];

    const loadingContainer = document.getElementById('loading-container');
    const loadingPacman = document.getElementById('loading-pacman');
    const loadingDotMask = document.getElementById('loading-dot-mask');
    const containerWidth = loadingContainer!.scrollWidth
      - loadingPacman!.scrollWidth;

    const gc = this.gameCoordinator
    const gameCoordRef = this.gameCoordinator;
    const modResources = gc.mod.getResources()
    const totalSources = imageAliases.length + modResources.length + audioSources.length;
    gc.remainingSources = totalSources;
    loadingPacman!.style.left = '0';
    loadingDotMask!.style.width = '0';      

    let loadedSources = 0
    //load images
    await Assets.load(imageAliases, (progress)=>{
      //console.log("loading assets", progress)
      gameCoordRef.remainingSources -= 1; 
      loadedSources += 1;
      const percent = 1 - gameCoordRef.remainingSources / totalSources;
      loadingPacman!.style.left = `${percent * containerWidth}px`;
      loadingDotMask!.style.width = loadingPacman!.style.left;
    })
    
    //initialize the current mod 
    await gc.mod.loadAssets((progress:number)=>{
      gameCoordRef.remainingSources -= 1
      loadedSources += 1;
      const percent = 1 - gameCoordRef.remainingSources / totalSources;
    })
    this.createTextures()
    this.createElements(audioSources,"audio", totalSources, gc)
    .then(()=>{
        loadingContainer!.style.opacity = "0";       
        setTimeout(() => {
          loadingContainer!.remove();
          gc.mainMenu!.style.opacity = "1";
          gc.mainMenu!.style.visibility = 'visible';
        }, 1500);
    }) 
  }
  /**
   * Iterates through a list of sources and updates the loading bar as the assets load in
   * @param {String[]} sources
   * @param {('img'|'audio')} type
   * @param {Number} totalSources
   * @param {Object} gameCoord
   * @returns {Promise}
   */
  createElements(sources:string[], type:string, totalSources:number, gameCoord:any):Promise<void> {
    const loadingContainer = document.getElementById('loading-container');
    const preloadDiv = document.getElementById('preload-div');
    const loadingPacman = document.getElementById('loading-pacman');
    const containerWidth = loadingContainer!.scrollWidth
      - loadingPacman!.scrollWidth;
    const loadingDotMask = document.getElementById('loading-dot-mask');

    const gameCoordRef = gameCoord;

    return new Promise<void>((resolve, reject) => {
      let loadedSources = 0;

      sources.forEach((source) => {
        const element = type === 'img' ? new Image() : new Audio();
        preloadDiv!.appendChild(element);

        const elementReady = () => {
          gameCoordRef.remainingSources -= 1;
          loadedSources += 1;
          const percent = 1 - gameCoordRef.remainingSources / totalSources;
          loadingPacman!.style.left = `${percent * containerWidth}px`;
          loadingDotMask!.style.width = loadingPacman!.style.left;

          if (loadedSources === sources.length) {
            resolve();
          }
        };

        if (type === 'img') {
          element.onload = elementReady;
          element.onerror = reject;
        } else {
          element.addEventListener('canplaythrough', elementReady);
          element.onerror = reject;
        }

        element.src = source;

        if (type === 'audio') {
          element.load();
        }
      });
    });
  }

  private createTextures() {
    //the maze background sprite
    this.textures.set("mazeBlue", Texture.from("maze_blue"))
    this.textures.set("mazeWhite", Texture.from("maze_white"))
    this.gameCoordinator.mazeSprite = new Sprite(Texture.from("maze_blue"))
    this.gameCoordinator.stage.addChild(this.gameCoordinator.mazeSprite)
    this.createPacmanSprite();
    this.createGhostsSprites()
    this.createPickupsSprite()
  }
  private createPacmanSprite() {
    let container = new Container();
    let sprite1 = new Sprite(Texture.from("arrow_left"));
    sprite1.position.set(0, 0);
    sprite1.anchor.set(0, 0);
    let sprite2 = new Sprite(Texture.from("arrow_right"));
    sprite2.position.set(32, 0);
    sprite2.anchor.set(0, 0);
    let sprite3 = new Sprite(Texture.from("arrow_up"));
    sprite3.position.set(64, 0);
    sprite3.anchor.set(0, 0);
    let sprite4 = new Sprite(Texture.from("arrow_down"));
    sprite4.position.set(96, 0);
    sprite4.anchor.set(0, 0);
    container.addChild(sprite1, sprite2, sprite3, sprite4);

    sprite1 = new Sprite(Texture.from("pacman_left"));
    sprite1.position.set(0, 32);
    sprite1.anchor.set(0, 0);
    sprite2 = new Sprite(Texture.from("pacman_right"));
    sprite2.position.set(0, 48);
    sprite2.anchor.set(0, 0);
    sprite3 = new Sprite(Texture.from("pacman_up"));
    sprite3.position.set(0, 64);
    sprite3.anchor.set(0, 0);
    sprite4 = new Sprite(Texture.from("pacman_down"));
    sprite4.position.set(0, 80);
    sprite4.anchor.set(0, 0);
    container.addChild(sprite1, sprite2, sprite3, sprite4);

    sprite1 = new Sprite(Texture.from("pacman_death"));
    sprite1.position.set(0, 96);
    sprite1.anchor.set(0, 0); 
    container.addChild(sprite1);

    let renderTexture = this.gameCoordinator.renderer.generateTexture(container)
    this.gameCoordinator.renderer.render(container,
      {renderTexture}
    );

    this.textures.set("pacman", renderTexture);
    
  }
  private createGhostsSprites() {
    let sprite1, sprite2, sprite3, sprite4, sprite5, sprite6, sprite7, sprite8,
      sprite9, sprite10, sprite11, sprite12
    const container = new Container()  
      sprite1 = new Sprite(Texture.from("blinky_left"));
      sprite1.position.set(0,0)
      sprite1.anchor.set(0,0)        
      sprite2 = new Sprite(Texture.from("blinky_right"));
      sprite2.position.set(0,16)
      sprite2.anchor.set(0,0)
      sprite3 = new Sprite(Texture.from("blinky_up"));
      sprite3.position.set(0,32)
      sprite3.anchor.set(0,0)
      sprite4 = new Sprite(Texture.from("blinky_down"));        
      sprite4.position.set(0,48)
      sprite4.anchor.set(0,0)   
      sprite5 = new Sprite(Texture.from("blinky_left_angry"));
      sprite5.position.set(0,64)
      sprite5.anchor.set(0,0)        
      sprite6 = new Sprite(Texture.from("blinky_right_angry"));
      sprite6.position.set(0,80)
      sprite6.anchor.set(0,0)
      sprite7 = new Sprite(Texture.from("blinky_up_angry"));
      sprite7.position.set(0,96)
      sprite7.anchor.set(0,0)
      sprite8 = new Sprite(Texture.from("blinky_down_angry"));        
      sprite8.position.set(0,112)
      sprite8.anchor.set(0,0)        
      sprite9 = new Sprite(Texture.from("blinky_left_annoyed"));
      sprite9.position.set(0,128)
      sprite9.anchor.set(0,0)        
      sprite10 = new Sprite(Texture.from("blinky_right_annoyed"));
      sprite10.position.set(0,144)
      sprite10.anchor.set(0,0)
      sprite11 = new Sprite(Texture.from("blinky_up_annoyed"));
      sprite11.position.set(0,160)
      sprite11.anchor.set(0,0)
      sprite12 = new Sprite(Texture.from("blinky_down_annoyed"));   
      sprite12.position.set(0,176)
      sprite12.anchor.set(0,0)        
      container.addChild(sprite1, sprite2, sprite3, sprite4, sprite5, sprite6,
        sprite7, sprite8, sprite9, sprite10, sprite11, sprite12
      )
      sprite1 = new Sprite(Texture.from("pinky_left"));
      sprite1.position.set(0,192)
      sprite1.anchor.set(0,0)  
      sprite2 = new Sprite(Texture.from("pinky_right"));
      sprite2.position.set(0,208)
      sprite2.anchor.set(0,0)  
      sprite3 = new Sprite(Texture.from("pinky_up"));
      sprite3.position.set(0,224)
      sprite3.anchor.set(0,0)  
      sprite4 = new Sprite(Texture.from("pinky_down"));      
      sprite4.position.set(0,240)
      sprite4.anchor.set(0,0)  
      container.addChild(sprite1, sprite2, sprite3, sprite4)
      sprite1 = new Sprite(Texture.from("inky_left"));
      sprite1.position.set(0,256)
      sprite1.anchor.set(0,0)  
      sprite2 = new Sprite(Texture.from("inky_right"));
      sprite2.position.set(0,272)
      sprite2.anchor.set(0,0)  
      sprite3 = new Sprite(Texture.from("inky_up"));
      sprite3.position.set(0,288)
      sprite3.anchor.set(0,0)  
      sprite4 = new Sprite(Texture.from("inky_down"));   
      sprite4.position.set(0,304)
      sprite4.anchor.set(0,0)  
      container.addChild(sprite1, sprite2, sprite3, sprite4)
      sprite1 = new Sprite(Texture.from("clyde_left"));
      sprite1.position.set(0,320)
      sprite1.anchor.set(0,0)  
      sprite2 = new Sprite(Texture.from("clyde_right"));
      sprite2.position.set(0,336)
      sprite2.anchor.set(0,0)  
      sprite3 = new Sprite(Texture.from("clyde_up"));
      sprite3.position.set(0,352)
      sprite3.anchor.set(0,0)  
      sprite4 = new Sprite(Texture.from("clyde_down"));   
      sprite4.position.set(0,368)
      sprite4.anchor.set(0,0)  
      container.addChild(sprite1, sprite2, sprite3, sprite4)
      sprite1 = new Sprite(Texture.from("eyes_left"));
      sprite1.position.set(0,384)
      sprite1.anchor.set(0,0) 
      sprite2 = new Sprite(Texture.from("eyes_right"));
      sprite2.position.set(0,400)
      sprite2.anchor.set(0,0) 
      sprite3 = new Sprite(Texture.from("eyes_up"));
      sprite3.position.set(0,416)
      sprite3.anchor.set(0,0) 
      sprite4 = new Sprite(Texture.from("eyes_down"));    
      sprite4.position.set(0,432)
      sprite4.anchor.set(0,0) 
      container.addChild(sprite1, sprite2, sprite3, sprite4)
      sprite1 = new Sprite(Texture.from("scared_blue"));
      sprite1.position.set(0,448)
      sprite1.anchor.set(0,0) 
      sprite2 = new Sprite(Texture.from("scared_white"));    
      sprite2.position.set(0,464)
      sprite2.anchor.set(0,0) 
      container.addChild(sprite1, sprite2)
        
    let renderTexture =  RenderTexture.create({ width: 32, height: 480 });    
    this.gameCoordinator.renderer.render(container, {
      renderTexture
    });
    this.textures.set("ghosts", renderTexture)
  }
  private createPickupsSprite() {
    let container = new Container() 
    let sprite1 = new Sprite(Texture.from("pacdot"));
    sprite1.position.set(0,0)
    sprite1.anchor.set(0,0)   
    container.addChild(sprite1)
    let sprite2 = new Sprite(Texture.from("powerPellet"));
    sprite2.position.set(0,16)
    sprite2.anchor.set(0,0)  
    container.addChild(sprite2)
    let sprite3 = new Sprite(Texture.from("cherry"));
    sprite3.position.set(0,32)
    sprite3.anchor.set(0,0)        
    let sprite4 = new Sprite(Texture.from("strawberry"));  
    sprite4.position.set(0,48)
    sprite4.anchor.set(0,0)
    let sprite5 = new Sprite(Texture.from("orange"));
    sprite5.position.set(0,64)
    sprite5.anchor.set(0,0)
    let sprite6 = new Sprite(Texture.from("apple"));  
    sprite6.position.set(0,80)
    sprite6.anchor.set(0,0) 
    let sprite7 = new Sprite(Texture.from("melon"));
    sprite7.position.set(0,96)
    sprite7.anchor.set(0,0) 
    let sprite8 = new Sprite(Texture.from("galaxian"));  
    sprite8.position.set(0,112)
    sprite8.anchor.set(0,0) 
    let sprite9 = new Sprite(Texture.from("bell"));
    sprite9.position.set(0,128)
    sprite9.anchor.set(0,0) 
    let sprite10 = new Sprite(Texture.from("key"));  
    sprite10.position.set(0,144)
    sprite10.anchor.set(0,0) 
    container.addChild(sprite3, sprite4, sprite5, sprite6,
      sprite7, sprite8, sprite9, sprite10
    )

    let renderTexture = RenderTexture.create({ width: 16, height: 160 });
    this.gameCoordinator.renderer.render(container, {
      renderTexture
    });
    this.textures.set("pickups", renderTexture)
  }
  getTexture(textureName:string, frameX?:number, frameY?:number, 
      width?:number, height?:number, spWidth?:number, spHeight?:number):Texture | undefined {
    let tx = this.textures.get(textureName.toString())
    let newTx 
    let txName
    if (tx) {
      if (frameX! >=0) {
        if(!width || !height)
          throw new Error("If the frameX or/and frameY is informed, width and hight should be paased as parameters.")
        if (!frameY)
          frameY = 0        
        txName = textureName+"_"+frameX+"_"+frameY
        newTx = Cache.get(txName)
        if (!newTx) {
          const rect = new Rectangle(frameX! * width, frameY * height, width, height)
          if (spWidth) rect.width  = spWidth
          if (spHeight) rect.height = spHeight
          newTx = new Texture(tx.castToBaseTexture(), rect)          
          Cache.set(txName, newTx)
        }
        tx = newTx           
      } 
    }else {
      //get from the cache directly
      return Cache.get(textureName.toString())
    }
    return tx
  }
}
//removeIf(production)
export default AssetsManager
//endRemoveIf