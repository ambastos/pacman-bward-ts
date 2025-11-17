import { Application, BaseTexture, Sprite, Texture, Container, Text,
  SCALE_MODES
 } from "pixi.js";
import * as PIXI from 'pixi.js'
import EventEmitter from "eventemitter3"
import Maze from "../mazes/maze.js";
import MazeManager from "./mazeManagert.js";
import SoundManager from "../utilities/soundManager.js";
import { Position } from "../characters/types.js";
import AssetsManager from "./assetsManager.js";
import Ghost from "../characters/ghost.js";
import Pacman from "../characters/pacman.js";
import Pickup from "../pickups/pickup.js";
import CharacterUtil from "../utilities/characterUtil.js";
import Entity from "../characters/entity.js";
import GameEngine from "./gameEngine.js";
import Timer from "../utilities/timer.js"; 
import Mod from "../../mods/mod.js";
import EmptyMod from "../../mods/empty-mod.js";
//global.window.Assets = Assets
//import path from 'path'
const options = {
    transparent: false,
    resolution: 1,
    antialias: false,      
}
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST
class GameCoordinator {
    mod:Mod
    gameUi:any
    rowTop:any
    mazeDiv:any
    mazeCover:any
    mainMenu:HTMLElement | null
    gameStartButton:any
    pauseButton:any
    soundButton:any
    leftCover:any
    rightCover:any
    pausedText:any
    bottomRow:any
    movementButtons:any
    maxFps:number
    tileSize:number
    scale:number
    scaledTileSize :number
    height:number
    width:number
    maze:Maze | undefined
    mazeArray:any
    firstGame:boolean; 
    movementKeys:any
    fruitPoints:any
    emitter!:EventEmitter
    soundManager!:SoundManager
    eyeGhosts!:number
    ghostCombo!:number
    am!:AssetsManager
    mazeSprite!:Sprite
    stage!: Container
    remainingSources!:number
    activeTimers!:Timer[];
    points:number = 0;
    level:number = 1;
    lives:number = 2;
    extraLifeGiven:boolean = false;
    remainingDots:number = 0;
    allowKeyPresses = true;
    allowPacmanMovement = false;
    allowPause = false;
    cutscene = true;
    highScore!:string | null
    pacman!:Pacman 
    blinky!:Ghost
    pinky!:Ghost
    inky!:Ghost
    clyde!:Ghost
    fruit!:Pickup
    entityList!:Entity [] ;
    ghosts!:Ghost[]
    scaredGhosts!:Ghost[];    
    idleGhosts!:Ghost[];
    pickups!:Pickup[]
    gameEngine!:GameEngine
    renderer!: PIXI.Renderer
    ghostCycleTimer!:Timer
    endIdleTimer!:Timer
    fruitTimer!:Timer
    ghostFlashTimer!:Timer
    topRender!:RendererTop    
    bottomRender!:RendererBottom  
    view!:any 
  constructor() {
    //super(options)
    this.mod = new EmptyMod(this)
    this.gameUi = document.getElementById('game-ui');
    this.rowTop = document.getElementById('row-top');   
    this.mazeDiv = document.getElementById('maze');
    this.mazeCover = document.getElementById('maze-cover');
    this.mainMenu = document.getElementById('main-menu-container');
    this.gameStartButton = document.getElementById('game-start');
    this.pauseButton = document.getElementById('pause-button');
    this.soundButton = document.getElementById('sound-button');
    this.leftCover = document.getElementById('left-cover');
    this.rightCover = document.getElementById('right-cover');
    this.pausedText = document.getElementById('paused-text');
    
    this.bottomRow = document.getElementById('bottom-row');
    this.movementButtons = document.getElementById('movement-buttons');

    const mm = new MazeManager()    
    this.maze = mm.get("maze1") 
    this.mazeArray = this.maze!.mazeArray

    this.maxFps = 120;
    this.tileSize = 8; 
    this.scale = this.determineScale(1);
    //this.scaledTileSize = this.tileSize * this.scale;
    this.scaledTileSize = this.tileSize * 1;
    this.height = this.scaledTileSize * 31
    this.width = this.scaledTileSize * 28
    this.maze!.setDimensions(this.width, this.height) 

    //PIXI
    window['PIXI'] = PIXI

    this.firstGame = true; 
    this.createUi()
    this.movementKeys = { 
      // WASD
      87: 'up',
      83: 'down',
      65: 'left',
      68: 'right',

      // Arrow Keys
      38: 'up',
      40: 'down',
      37: 'left',
      39: 'right',
    };

    this.fruitPoints = {
      1: 100,
      2: 300,
      3: 500,
      4: 700,
      5: 1000,
      6: 2000,
      7: 3000,
      8: 5000,
    };

    this.gameStartButton.addEventListener(
    'click',
    this.startButtonClick.bind(this),
    );
    this.pauseButton.addEventListener('click', this.handlePauseKey.bind(this));
    this.soundButton.addEventListener(
    'click',
    this.soundButtonClick.bind(this),
    );

    let head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'build/app.css'; 

    link.onload = this.preloadAssets.bind(this);

    head?.appendChild(link);
    
  }
  
  /**
   * Included to accpet a new mod to the game
   * @param {Mod} mod
   */
  setMod(mod: Mod) {
    this.mod = mod 
  }

  /**
   * Recursive method which determines the largest possible scale the game's graphics can use
   * @param {Number} scale
   */
  determineScale(scale:number):number {
    const availableScreenHeight = Math.min(
      document.documentElement.clientHeight,
      window.innerHeight || 0,
    );
    const availableScreenWidth = Math.min(
      document.documentElement.clientWidth,
      window.innerWidth || 0,
    );
    const scaledTileSize = this.tileSize * scale;

    // The original Pac-Man game leaves 5 tiles of height (3 above, 2 below) surrounding the
    // maze for the UI. See app\style\graphics\spriteSheets\references\mazeGridSystemReference.png
    // for reference.
    const mazeTileHeight = this.mazeArray.length + 5;
    const mazeTileWidth = this.mazeArray[0][0].split('').length;

    if (
      scaledTileSize * mazeTileHeight < availableScreenHeight
      && scaledTileSize * mazeTileWidth < availableScreenWidth
    ) {
      return this.determineScale(scale + 1);
    }

    return scale - 1;
  }

  /**
   * Reveals the game underneath the loading covers and starts gameplay
   */
  startButtonClick():void {
    this.leftCover.style.left = '-50%';
    this.rightCover.style.right = '-50%';
    this.mainMenu!.style.opacity = "0";
    this.gameStartButton.disabled = true;

    setTimeout(() => {
      this.mainMenu!.style.visibility = 'hidden';
    }, 1000);

    this.reset();
    if (this.firstGame) {
      this.firstGame = false;
      this.init();
    }
    this.startGameplay(true);
  }

  /**
   * Toggles the master volume for the soundManager, and saves the preference to storage
   */
  soundButtonClick() {
    const newVolume = this.soundManager.masterVolume === 1 ? 0 : 1;
    this.soundManager.setMasterVolume(newVolume);
    localStorage.setItem('volumePreference', newVolume.toString());
    this.setSoundButtonIcon(newVolume);
  }

  /**
   * Sets the icon for the sound button
   */
  setSoundButtonIcon(newVolume:number) {
    this.soundButton.innerHTML = newVolume === 0 ? 'volume_off' : 'volume_up';
  }

  /**
   * Displays an error message in the event assets are unable to download
   */
  displayErrorMessage() {
    const loadingContainer = document.getElementById('loading-container');
    const errorMessage = document.getElementById('error-message');
    loadingContainer!.style.opacity = "0";
    setTimeout(() => {
      loadingContainer!.remove();
      errorMessage!.style.opacity = 1+ "" ;
      errorMessage!.style.visibility = 'visible';
    }, 1500);
  }

  /**
   * Load all assets into a hidden Div to pre-load them into memory.
   */
  async preloadAssets() {
     this.am = new AssetsManager(this)
     await this.am.load()    
  }

  /**
   * Resets gameCoordinator values to their default states
   */
  reset() {
    this.activeTimers = [];
    this.points = 0;
    this.level = 1;
    this.lives = 2;
    this.extraLifeGiven = false;
    this.remainingDots = 0;
    this.allowKeyPresses = true;
    this.allowPacmanMovement = false;
    this.allowPause = false;
    this.cutscene = true;
    this.highScore = localStorage.getItem('highScore');

    if (this.firstGame) {      
      setInterval(() => {
        this.collisionDetectionLoop();
      }, 500);

      this.pacman = new Pacman(
        this,
        new CharacterUtil(),
      );
      this.blinky = new Ghost(
        this,
        'blinky',
        this.level,
        new CharacterUtil(),
      );
      this.pinky = new Ghost(
        this,
        'pinky',
        this.level,
        new CharacterUtil(),
      );
      this.inky = new Ghost(
        this,
        'inky',
        this.level,
        new CharacterUtil(),
        this.blinky,
      );
      this.clyde = new Ghost(
        this,
        'clyde',
        this.level,
        new CharacterUtil(),
      );
      this.fruit = new Pickup(
        'fruit',
        13.5,
        17,        
        100,
        this
      );
    }

    this.entityList = [
      this.pacman,
      this.blinky,
      this.pinky,
      this.inky,
      this.clyde,
      this.fruit,
    ];

    this.ghosts = [this.blinky, this.pinky, this.inky, this.clyde];

    this.scaredGhosts = [];
    this.eyeGhosts = 0;

    if (this.firstGame) {      

      //add dots,  pacman, ghosts sprites to the stage
      this.drawMaze(this.mazeArray, this.entityList);
      this.pickups.forEach(p=>{
          //@ts-ignore
          this.stage.addChild(p.sprite)
      })
      //@ts-ignore
      this.stage.addChild(this.pacman.sprite)
      //@ts-ignore
      this.stage.addChild(this.pacman.spriteArrow)
      this.ghosts.forEach(g=>{
        //@ts-ignore
        this.stage.addChild(g.sprite)
      })
      this.soundManager = new SoundManager();      
      this.setUiDimensions();
    } else {
      this.pacman.reset();
      this.ghosts.forEach((ghost) => {
        ghost.reset(true);
      });
      this.pickups.forEach((pickup) => {
        if (pickup.type !== 'fruit') {
          this.remainingDots += 1;
          pickup.reset();
          this.entityList.push(pickup);
        }
      });
    }

    this.updatePoints()
    this.updateHightScore()
    this.clearDisplay("fruitsDisplay")

    const vp = localStorage.getItem('volumePreference')
    const volumePreference:number = vp ? Number(vp) : 1
    this.setSoundButtonIcon(volumePreference);
    this.soundManager.setMasterVolume(volumePreference);
    
  }

  /**
   * Calls necessary setup functions to start the game
   */
  init() {
    //initialize the current mod values    
    this.registerEventListeners();
    this.mod.initialize()

    this.gameEngine = new GameEngine(this, this.maxFps, this.entityList);
    this.gameEngine.start();
  }

  /**
   * Adds HTML elements to draw on the webpage by iterating through the 2D maze array
   * @param {Array} mazeArray - 2D array representing the game board
   * @param {Array} entityList - List of entities to be used throughout the game
   */
  drawMaze(mazeArray:any, entityList:Entity[]) {
    this.pickups = [this.fruit];
  
    this.mazeDiv.style.height = `${this.height* this.scale}px`;
    this.mazeDiv.style.width = `${this.width* this.scale}px`;
    this.gameUi.style.width = `${this.width * this.scale}px`;
    this.bottomRow.style.minHeight = `${this.scaledTileSize * 2}px`;

    mazeArray.forEach((row:[], rowIndex:number) => {
      row.forEach((block:string, columnIndex:number) => {        
        if (block === 'o' || block === 'O') {
          const type = block === 'o' ? 'pacdot' : 'powerPellet';
          const points = block === 'o' ? 10 : 50;
          const dot:Pickup = new Pickup(
            type,            
            columnIndex,
            rowIndex,            
            points,
            this
          );
          entityList.push(dot);
          this.pickups.push(dot);
          this.remainingDots += 1;
        }
      });
    });
  } 

  createUi() {
    this.topRender = new RendererTop(this, {
      backgroundColor: 0x0000ff,
      width: this.width * this.scale,
      height: this.height * 0.09 * this.scale 
    } as PIXI.IRendererOptions) 
    this.topRender.update()

    this.bottomRender = new RendererBottom(this,{
      backgroundColor: 0x0000ff,
      width: this.width * this.scale,
      height: this.height * 0.06 * this.scale
    } as PIXI.IRendererOptions)
    this.bottomRender.update()

     //canvas view     
    this.view = document.createElement("canvas")
    this.view.width = (this.tileSize * 28) * this.scale
    this.view.height = (this.tileSize * 31) * this.scale
    this.mazeDiv.appendChild(this.view)
    this.view.classList.add("view") 

    this.stage = new Container()
    this.stage.sortableChildren = true
    this.stage.scale.set(this.scale)
    const opts = {
      view: this.view, 
      width: this.view.width,
      height: this.view.height
    }
    for (let opt in options ) 
      //@ts-ignore
      opts[opt] = options[opt]
    
    this.renderer = new PIXI.Renderer(opts)
  }

  setUiDimensions() {
    this.gameUi.style.fontSize = `${this.scaledTileSize}px`;
    this.rowTop.style.marginBottom = `${this.scaledTileSize}px`;
  }

  render() {
    //super.render()
    this.renderer.render(this.stage)
    if (this.topRender)
      this.topRender.render(this.topRender.container)
    if (this.bottomRender)
      this.bottomRender.render(this.bottomRender.container)
  }

  /**
   * Loop which periodically checks which pickups are nearby Pacman.
   * Pickups which are far away will not be considered for collision detection.
   */
  collisionDetectionLoop() {
    if (this.pacman.position) {
      const maxDistance = this.pacman.velocityPerMs * 750;
      const pacmanCenter = {
        x: this.pacman.position.left + this.scaledTileSize,
        y: this.pacman.position.top + this.scaledTileSize,
      };

      // Set this flag to TRUE to see how two-phase collision detection works!
      const debugging = false;

      this.pickups.forEach((pickup) => {
        pickup.checkPacmanProximity(maxDistance, pacmanCenter, debugging);
      });
    }
  }

  /**
   * Displays "Ready!" and allows Pacman to move after a breif delay
   * @param {Boolean} initialStart - Special condition for the game's beginning
   */
  startGameplay(initialStart?:boolean) {
    if (initialStart) {
      this.soundManager.play('game_start');
    }

    this.scaredGhosts = [];
    this.eyeGhosts = 0;
    this.allowPacmanMovement = false;

    const left = this.scaledTileSize * 11;
    const top = this.scaledTileSize * 16.5;
    const duration = initialStart ? 4500 : 2000;
    const width = this.scaledTileSize * 6;
    const height = this.scaledTileSize * 2;

    this.displayText({ left, top }, 'ready', duration, width, height);
    this.updateExtraLivesDisplay();

    new Timer(() => {

      //for mods. start the mod 
      this.mod.start() 

      this.allowPause = true;
      this.cutscene = false;
      this.soundManager.setCutscene(this.cutscene);
      this.soundManager.setAmbience(this.determineSiren(this.remainingDots), false);

      this.allowPacmanMovement = true;
      this.pacman.moving = true;

      this.ghosts.forEach((ghost) => {
        const ghostRef = ghost;
        ghostRef.moving = true;
      });

      this.ghostCycle('scatter');

      this.idleGhosts = [this.pinky, this.inky, this.clyde];
      this.releaseGhost();  
      this.emitter.emit("post-start")    
    }, duration);
  }
  /**
   * Clears out all children nodes from a given display element
   * @param {String} displayName
   */  
  clearDisplay(displayName:string) {
    const display = this.bottomRender.container.getChildByName(displayName)
    //@ts-ignore
    if (display) display.children.length = 0
  }

  updatePoints() {
    this.topRender.update()
  }
  updateHightScore() {
    this.topRender.update()
  }
  
  /**
   * Displays extra life images equal to the number of remaining lives
   */
  updateExtraLivesDisplay() {
    this.clearDisplay("livesDisplay") 

    const livesDisplay = this.bottomRender.container.getChildByName("livesDisplay")
    let tx = this.am.getTexture("extra_life")
    for (let i = 0; i < this.lives; i += 1) {
      let extraLifeSprite = new Sprite(tx)
      extraLifeSprite.x = extraLifeSprite.width * i
      //@ts-ignore
      livesDisplay!.addChild(extraLifeSprite)
    }
  }

  /**
   * Displays a rolling log of the seven most-recently eaten fruit
   * @param {number} points
   */
  updateFruitsDisplay(points:number) {
    const name = this.fruit.getFruitName(points)
    const fruitsDisplay = this.bottomRender.container.getChildByName("fruitsDisplay")
    //@ts-ignore
    if (fruitsDisplay!.length ==7) {
      //@ts-ignore
      const first = fruitsDisplay!.getChildAt(0)
      if (first) fruitsDisplay!.removeChild(first)
    }
    const fruitSp = new Sprite(this.am.getTexture(name))
    let x = 0
    //@ts-ignore
    fruitsDisplay!.children.forEach(f=>x+=f.width)
    x+=fruitSp.width
    fruitSp.position.x = this.width - x
    //@ts-ignore
    fruitsDisplay!.addChild(fruitSp)
  }

  /**
   * Cycles the ghosts between 'chase' and 'scatter' mode
   * @param {('chase'|'scatter')} mode
   */
  ghostCycle(mode:string) {
    const delay = mode === 'scatter' ? 7000 : 20000;
    const nextMode = mode === 'scatter' ? 'chase' : 'scatter';

    this.ghostCycleTimer = new Timer(() => {
      this.ghosts.forEach((ghost) => {
        ghost.changeMode(nextMode);
      });

      this.ghostCycle(nextMode);
    }, delay);
  }

  /**
   * Releases a ghost from the Ghost House after a delay
   */
  releaseGhost() {
    if (this.idleGhosts.length > 0) {
      const delay = Math.max((8 - (this.level - 1) * 4) * 1000, 0);

      this.endIdleTimer = new Timer(() => {
        this.idleGhosts[0]!.endIdleMode();
        this.idleGhosts.shift();
      }, delay);
    }
  }

  /**
   * Register listeners for various game sequences
   */
  registerEventListeners() {
    //events: 
    //  load, start, post-start, pacman-death, post-death, ghost-eaten-<ghostName>, item-taken (item as argument),
    //  advance-level, game-over, speed-up-blinky, create-fruit
    this.emitter = new EventEmitter()        
    this.entityList.forEach((e)=>{
      e.emitter = this.emitter
      e.registerEventListeners()
    })
    this.emitter.on("start", this.startGameplay.bind(this)) 
    this.emitter.on("advance-level", this.advanceLevel.bind(this))
    this.emitter.on("speed-up-blinky", this.speedUpBlinky.bind(this))
    this.emitter.on("create-fruit", this.createFruit.bind(this))
    this.emitter.on("game-over", this.gameOver.bind(this)) 
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    //@ts-ignore
    window.addEventListener('awardPoints', this.awardPoints.bind(this));
    //@ts-ignore
    window.addEventListener('deathSequence', this.deathSequence.bind(this));
    window.addEventListener('dotEaten', this.dotEaten.bind(this));
    window.addEventListener('powerUp', this.powerUp.bind(this));
    //@ts-ignore
    window.addEventListener('eatGhost', this.eatGhost.bind(this));
    window.addEventListener('restoreGhost', this.restoreGhost.bind(this));
    //@ts-ignore
    window.addEventListener('addTimer', this.addTimer.bind(this));
    //@ts-ignore
    window.addEventListener('removeTimer', this.removeTimer.bind(this));
    window.addEventListener('releaseGhost', this.releaseGhost.bind(this));

    const directions = ['up', 'down', 'left', 'right'];

    directions.forEach((direction) => {
      document
        .getElementById(`button-${direction}`)!
        .addEventListener('touchstart', () => {
          this.changeDirection(direction);
        });
    });
  }

  /**
   * Calls Pacman's changeDirection event if certain conditions are met
   * @param {({'up'|'down'|'left'|'right'})} direction
   */
  changeDirection(direction:string) {
    if (this.allowKeyPresses && this.gameEngine.running) {
      this.pacman.changeDirection(direction, this.allowPacmanMovement);
    }
  }

  /**
   * Calls various class functions depending upon the pressed key
   * @param {Event} e - The keydown event to evaluate
   */
  handleKeyDown(e:KeyboardEvent) {
    if (e.keyCode === 27) {
      // ESC key
      this.handlePauseKey();
    } else if (e.keyCode === 81) {
      // Q
      this.soundButtonClick();
    } else if (this.movementKeys[e.keyCode]) {
      this.changeDirection(this.movementKeys[e.keyCode]);
    }
  }

  /**
   * Handle behavior for the pause key
   */
  handlePauseKey() {
    if (this.allowPause) {
      this.allowPause = false;

      setTimeout(() => {
        if (!this.cutscene) {
          this.allowPause = true;
        }
      }, 500);

      this.gameEngine.changePausedState(this.gameEngine.running);
      this.soundManager.play('pause');

      if (this.gameEngine.started) {
        this.soundManager.resumeAmbience(false);
        this.gameUi.style.filter = 'unset';
        this.movementButtons.style.filter = 'unset';
        this.pausedText.style.visibility = 'hidden';
        this.pauseButton.innerHTML = 'pause';
        this.activeTimers.forEach((timer) => {
          timer.resume();
        });
      } else {
        this.soundManager.stopAmbience();
        this.soundManager.setAmbience('pause_beat', true);
        this.gameUi.style.filter = 'blur(5px)';
        this.movementButtons.style.filter = 'blur(5px)';
        this.pausedText.style.visibility = 'visible';
        this.pauseButton.innerHTML = 'play_arrow';
        this.activeTimers.forEach((timer) => {
          timer.pause();
        });
      }
    }
  }

  /**
   * Adds points to the player's total
   * @param {({ detail: { points: Number }})} e - Contains a quantity of points to add
   */
  awardPoints(e:CustomEvent) {
    this.points += e.detail.points;
    this.updatePoints()
    if (this.points > (Number(this.highScore) || 0)) {
      this.highScore = this.points.toString();
      this.updateHightScore()
      localStorage.setItem('highScore', this.highScore);
    }

    if (this.points >= 10000 && !this.extraLifeGiven) {
      this.extraLifeGiven = true;
      this.soundManager.play('extra_life');
      this.lives += 1;
      this.updateExtraLivesDisplay();
    }

    if (e.detail.type === 'fruit') {
      const left = e.detail.points >= 1000
        ? this.scaledTileSize * 12.5
        : this.scaledTileSize * 13;
      const top = this.scaledTileSize * 16.5;
      const width = e.detail.points >= 1000
        ? this.scaledTileSize * 3
        : this.scaledTileSize * 2;
      const height = this.scaledTileSize * 2;

      this.displayText({ left, top }, e.detail.points, 2000, width, height);
      this.soundManager.play('fruit');
      this.updateFruitsDisplay(e.detail.points)
    }
  }

  /**
   * Animates Pacman's death, subtracts a life, and resets character positions if
   * the player has remaining lives.
   */
  /**
   * Changed to suport events details values to change the behavior of this method 
   */
  deathSequence(event:CustomEvent) {
    this.allowPause = false;
    this.cutscene = true;
    this.soundManager.setCutscene(this.cutscene);
    this.soundManager.stopAmbience();
    this.removeTimer({ detail: { timer: this.fruitTimer } } as CustomEvent);
    this.removeTimer({ detail: { timer: this.ghostCycleTimer } } as CustomEvent);
    this.removeTimer({ detail: { timer: this.endIdleTimer } } as CustomEvent);
    this.removeTimer({ detail: { timer: this.ghostFlashTimer } } as CustomEvent);

    this.allowKeyPresses = false;
    this.pacman.moving = false;
    this.ghosts.forEach((ghost) => {
      const ghostRef = ghost;
      ghostRef.moving = false;
    });

    new Timer(() => {
      this.ghosts.forEach((ghost) => {
        const ghostRef = ghost;
        ghostRef.display = false;
      });
      this.pacman.prepDeathAnimation();
      this.soundManager.play('death');

      if (this.lives > 0) {
        this.lives -= 1;

      let callbackAfter = (event?.detail?.callbackAfter)
      if (callbackAfter)
          callbackAfter()
        new Timer(() => {
          this.emitter.emit("post-death")
          this.mazeCover.style.visibility = 'visible';
          new Timer(() => {
            this.allowKeyPresses = true;
            this.mazeCover.style.visibility = 'hidden';
            this.pacman.reset();
            this.ghosts.forEach((ghost) => {
              ghost.reset();
            });
            this.fruit.hideFruit();
            let shouldRestart =  (event?.detail?.restart) === undefined ?  true : (event.detail.restart)
            
            if (shouldRestart )
              this.emitter.emit("start")
          }, 500);
        }, 2250);
      } else {
        this.emitter.emit("game-over")
      }
    }, 750);
  }

  /**
   * Displays GAME OVER text and displays the menu so players can play again
   */
  gameOver() {
    localStorage.setItem('highScore', this.highScore!);

    new Timer(() => {      
      //for mods
      this.mod.stop()

      this.displayText(
        {
          left: this.scaledTileSize * 9,
          top: this.scaledTileSize * 16.5,
        },
        'game_over',
        4000,
        this.scaledTileSize * 10,
        this.scaledTileSize * 2,
      );
      this.fruit.hideFruit();

      new Timer(() => {
        this.leftCover.style.left = '0';
        this.rightCover.style.right = '0';

        setTimeout(() => {
          this.mainMenu!.style.opacity = "1";
          this.gameStartButton.disabled = false;
          this.mainMenu!.style.visibility = 'visible';
        }, 1000);
      }, 2500);
    }, 2250);
  }

  /**
   * Handle events related to the number of remaining dots
   */
  dotEaten() {
    this.remainingDots -= 1;

    this.soundManager.playDotSound();

    if (this.remainingDots === 174 || this.remainingDots === 74) {
      this.emitter.emit("create-fruit")
    }

    if (this.remainingDots === 40 || this.remainingDots === 20) {
      this.emitter.emit("speed-up-blinky")
    }

    if (this.remainingDots === 0) {
      this.emitter.emit("advance-level")
    }
  }

  /**
   * Creates a bonus fruit for ten seconds
   */
  createFruit() {
    this.removeTimer({ detail: { timer: this.fruitTimer } } as CustomEvent);
    this.fruit.showFruit(this.fruitPoints[this.level] || 5000);
    this.fruitTimer = new Timer(() => {
      this.fruit.hideFruit();
    }, 10000);
  }

  /**
   * Speeds up Blinky and raises the background noise pitch
   */
  speedUpBlinky() {
    this.blinky.speedUp();

    if (this.scaredGhosts.length === 0 && this.eyeGhosts === 0) {
      this.soundManager.setAmbience(this.determineSiren(this.remainingDots));
    }
  }

  /**
   * Determines the correct siren ambience
   * @param {Number} remainingDots
   * @returns {String}
   */
  determineSiren(remainingDots:number):string {
    let sirenNum;

    if (remainingDots > 40) {
      sirenNum = 1;
    } else if (remainingDots > 20) {
      sirenNum = 2;
    } else {
      sirenNum = 3;
    }

    return `siren_${sirenNum}`;
  }

  /**
   * Resets the gameboard and prepares the next level
   */
  advanceLevel() {
    this.allowPause = false;
    this.cutscene = true;
    this.soundManager.setCutscene(this.cutscene);
    this.allowKeyPresses = false;
    this.soundManager.stopAmbience();

    //stop the current mod    
    this.mod.stop()

    this.entityList.forEach((entity) => {
      const entityRef = entity;
      entityRef.moving = false;
    });

    this.removeTimer({ detail: { timer: this.fruitTimer } } as CustomEvent);
    this.removeTimer({ detail: { timer: this.ghostCycleTimer } } as CustomEvent);
    this.removeTimer({ detail: { timer: this.endIdleTimer } } as CustomEvent);
    this.removeTimer({ detail: { timer: this.ghostFlashTimer } } as CustomEvent);

    new Timer(() => {
      this.ghosts.forEach((ghost) => {
        const ghostRef = ghost;
        ghostRef.display = false;
      });
      this.mazeSprite.texture = Texture.from("maze_white")
      new Timer(() => {
        this.mazeSprite.texture = Texture.from("maze_blue")
        new Timer(() => {
          this.mazeSprite.texture = Texture.from("maze_white")
          new Timer(() => {
            this.mazeSprite.texture = Texture.from("maze_blue")
            new Timer(() => {
              this.mazeSprite.texture = Texture.from("maze_white")
              new Timer(() => {
                this.mazeSprite.texture = Texture.from("maze_blue")
                new Timer(() => {                  
                  this.mazeSprite.visible = false
                  new Timer(() => {
                    this.mazeSprite.visible = true
                    this.mazeCover.style.visibility = 'hidden';
                    this.level += 1;
                    this.allowKeyPresses = true;
                    this.entityList.forEach((entity) => {
                      const entityRef = entity;
                      if (entityRef.level) {
                        entityRef.level = this.level;
                      }
                      entityRef.reset();
                      if (entityRef instanceof Ghost) {
                        entityRef.resetDefaultSpeed();
                      }
                      if (
                        entityRef instanceof Pickup
                        && entityRef.type !== 'fruit'
                      ) {
                        this.remainingDots += 1;
                      }
                    });
                    this.startGameplay();
                  }, 500);
                }, 250);
              }, 250);
            }, 250);
          }, 250);
        }, 250);
      }, 250);
    }, 2000);
  }

  /**
   * Flashes ghosts blue and white to indicate the end of the powerup
   * @param {Number} flashes - Total number of elapsed flashes
   * @param {Number} maxFlashes - Total flashes to show
   */
  flashGhosts(flashes:number, maxFlashes:number) {
    if (flashes === maxFlashes) {
      this.scaredGhosts.forEach((ghost) => {
        ghost.endScared();
      });
      this.scaredGhosts = [];
      if (this.eyeGhosts === 0) {
        this.soundManager.setAmbience(this.determineSiren(this.remainingDots));
      }
    } else if (this.scaredGhosts.length > 0) {
      this.scaredGhosts.forEach((ghost) => {
        ghost.toggleScaredColor();
      });

      this.ghostFlashTimer = new Timer(() => {
        this.flashGhosts(flashes + 1, maxFlashes);
      }, 250);
    }
  }

  /**
   * Upon eating a power pellet, sets the ghosts to 'scared' mode
   */
  powerUp() {
    if (this.remainingDots !== 0) {
      this.soundManager.setAmbience('power_up');
    }

    this.removeTimer({ detail: { timer: this.ghostFlashTimer } } as CustomEvent);

    this.ghostCombo = 0;
    this.scaredGhosts = [];

    this.ghosts.forEach((ghost) => {
      if (ghost.mode !== 'eyes') {
        this.scaredGhosts.push(ghost);
      }
    });

    this.scaredGhosts.forEach((ghost) => {
      ghost.becomeScared();
    });

    const powerDuration = Math.max((7 - this.level) * 1000, 0);
    this.ghostFlashTimer = new Timer(() => {
      this.flashGhosts(0, 9);
    }, powerDuration);
  }

  /**
   * Determines the quantity of points to give based on the current combo
   */
  determineComboPoints() {
    return 100 * (2 ** this.ghostCombo);
  }

  /**
   * Upon eating a ghost, award points and temporarily pause movement
   * @param {CustomEvent} e - Contains a target ghost object
   */
  eatGhost(e:CustomEvent) {
    const pauseDuration = 1000;
    const { position, measurement } = e.detail.ghost;

    this.pauseTimer({ detail: { timer: this.ghostFlashTimer } } as CustomEvent);
    this.pauseTimer({ detail: { timer: this.ghostCycleTimer } } as CustomEvent);
    this.pauseTimer({ detail: { timer: this.fruitTimer } } as CustomEvent);
    this.soundManager.play('eat_ghost');

    this.scaredGhosts = this.scaredGhosts.filter(
      ghost => ghost.name !== e.detail.ghost.name,
    );
    this.eyeGhosts += 1;

    this.ghostCombo += 1;
    const comboPoints = this.determineComboPoints();
    window.dispatchEvent(
      new CustomEvent('awardPoints', {
        detail: {
          points: comboPoints,
        },
      }),
    );
    this.displayText(position, comboPoints, pauseDuration, measurement);

    this.allowPacmanMovement = false;
    this.pacman.display = false;
    this.pacman.moving = false;
    e.detail.ghost.display = false;
    e.detail.ghost.moving = false;

    this.ghosts.forEach((ghost) => {
      const ghostRef = ghost;
      ghostRef.animate = false;
      ghostRef.pause(true);
      ghostRef.allowCollision = false;
    });

    new Timer(() => {
      this.soundManager.setAmbience('eyes');

      this.resumeTimer({ detail: { timer: this.ghostFlashTimer } } as CustomEvent);
      this.resumeTimer({ detail: { timer: this.ghostCycleTimer } } as CustomEvent);
      this.resumeTimer({ detail: { timer: this.fruitTimer } } as CustomEvent);
      this.allowPacmanMovement = true;
      this.pacman.display = true;
      this.pacman.moving = true;
      e.detail.ghost.display = true;
      e.detail.ghost.moving = true;
      this.ghosts.forEach((ghost) => {
        const ghostRef = ghost;
        ghostRef.animate = true;
        ghostRef.pause(false);
        ghostRef.allowCollision = true;
      });
    }, pauseDuration);
  }

  /**
   * Decrements the count of "eye" ghosts and updates the ambience
   */
  restoreGhost() {
    this.eyeGhosts -= 1;
    if (this.eyeGhosts === 0) {
      const sound = this.scaredGhosts.length > 0
        ? 'power_up'
        : this.determineSiren(this.remainingDots);
      this.soundManager.setAmbience(sound);
    }
  }

  /**
   * Creates a temporary div to display points on screen
   * @param {({ left: number, top: number })} position - CSS coordinates to display the points at
   * @param {Number} amount - Amount of points to display
   * @param {Number} duration - Milliseconds to display the points before disappearing
   * @param {Number} width - Image width in pixels
   * @param {Number} height - Image height in pixels
   */
  displayText(position:Position, amount:any, duration:number, width:number, height?:number) {
    let textSp 
    const texture = this.am.getTexture(amount)
    if (texture)
      textSp = new Sprite(texture)
    else 
      textSp = new Text(amount, {
        fontFamily: "Press Start 2P",
        fontSize: 6,
        fill: 0xffffff
      })
    textSp.width = width  
    textSp.height = height || width
    textSp.position.set(position.left, position.top)

    this.stage.addChild(textSp)

    new Timer(() => {
      this.stage.removeChild(textSp)
    }, duration);
  }

  /**
   * Pushes a Timer to the activeTimers array
   * @param {({ detail: { timer: Object }})} e
   */
  addTimer(e: CustomEvent):void {
    this.activeTimers.push(e.detail.timer);
  }

  /**
   * Checks if a Timer with a matching ID exists
   * @param {({ detail: { timer: Object }})} e
   * @returns {Boolean}
   */
  timerExists(e:CustomEvent):boolean {
    return !!(e.detail.timer || {}).timerId;
  }

  /**
   * Pauses a timer
   * @param {({ detail: { timer: Object }})} e
   */
  pauseTimer(e:CustomEvent) {
    if (this.timerExists(e)) {
      e.detail.timer.pause(true);
    }
  }

  /**
   * Resumes a timer
   * @param {({ detail: { timer: Object }})} e
   */
  resumeTimer(e:CustomEvent) {
    if (this.timerExists(e)) {
      e.detail.timer.resume(true);
    }
  }

  /**
   * Removes a Timer from activeTimers
   * @param {({ detail: { timer: Object }})} e
   */
  removeTimer(e:CustomEvent) {
    if (this.timerExists(e)) {
      window.clearTimeout(e.detail.timer.timerId);
      this.activeTimers = this.activeTimers.filter(
        timer => timer.timerId !== e.detail.timer.timerId,
      );
    }
  }
}
// removeIf(production)
export default GameCoordinator
// endRemoveIf(production)

class RendererTop extends PIXI.Renderer {
  container:Container = new Container()
  player1Label:Text
  points:Text
  highScoreLabel:Text
  highScore:Text
  gc:GameCoordinator
  constructor(gameCoordinator:GameCoordinator, options:PIXI.IRendererOptions) {
    super(options) 
    this.gc = gameCoordinator   
    const textStyle = {
      fontFamily: "Press Start 2P, sans-serif",
      fontSize: 8,
      //fontWeight: "bold",
      fill: "0xffffff",      
    }
    this.player1Label = new Text("", textStyle)
    this.points = new Text("", textStyle)
    this.highScoreLabel = new Text("", textStyle)
    this.highScore = new Text("", textStyle)
    this.container.addChild(this.player1Label, this.points, this.highScoreLabel, this.highScore)
    this.initialize()
  }
  private initialize() {
    //@ts-ignore
    //this.view.classList.add("row-top-view")
    //@ts-ignore
    this.gc.rowTop.appendChild(this.view) 
    this.container.scale.set(this.gc.scale)
  }
  update() { 
    this.player1Label.text = ""
    this.player1Label.style.align = "left"
    this.player1Label.text = "1UP"
    this.points.text = ""
    this.points.text = this.gc.points
    this.points.style.align = "right"
    this.highScoreLabel.style.align = "center"
    this.highScoreLabel.text = ""  
    this.highScoreLabel.text = "HIGH SCORE"
    this.highScore.style.align = "center"
    this.highScore.text = this.gc.highScore ? this.gc.highScore : 0
 
    let x = 0, y = 2
    //text.scale.set(0.333) 
    x = this.gc.width * 0.10 - this.player1Label.width * 0.5    
    this.player1Label.position.set(x,y)
    const line2y = this.view.height / (2 * this.gc.scale) * 0.9
    y = line2y
    x = this.gc.width * 0.20 - this.points.width * 0.5
    this.points.position.set(x, y)   
    //text.scale.set(0.333)
    x = this.gc.width * 0.50 - this.highScoreLabel.width * 0.5    
    y = 2
    this.highScoreLabel.position.set(x,y)    
    x = this.gc.width * 0.50 - this.highScore.width * 0.5
    y = line2y
    this.highScore.position.set(x, y)  
  }
}

class RendererBottom extends PIXI.Renderer {
  gc:GameCoordinator
  container = new Container()
  constructor(gameCoordinator:GameCoordinator, options:PIXI.IRendererOptions) {
    super(options)
    this.gc = gameCoordinator   
    //@ts-ignore
 //   this.view.classList.add("row-bottom-view")
    this.container.scale.set(this.gc.scale)
    const livesDisplay = new Container()
    livesDisplay.name = "livesDisplay"
    this.container.addChild(livesDisplay)
    const fruitsDisplay = new Container() 
    fruitsDisplay.name = "fruitsDisplay" 
    fruitsDisplay.x = this.container.width
    this.container.addChild(fruitsDisplay)
    //@ts-ignore
    this.gc.bottomRow.appendChild(this.view) 
  }
  update() {
    
  }
}