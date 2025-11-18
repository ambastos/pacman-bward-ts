"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
const PIXI = __importStar(require("pixi.js"));
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const mazeManagert_js_1 = __importDefault(require("./mazeManagert.js"));
const soundManager_js_1 = __importDefault(require("../utilities/soundManager.js"));
const assetsManager_js_1 = __importDefault(require("./assetsManager.js"));
const ghost_js_1 = __importDefault(require("../characters/ghost.js"));
const pacman_js_1 = __importDefault(require("../characters/pacman.js"));
const pickup_js_1 = __importDefault(require("../pickups/pickup.js"));
const characterUtil_js_1 = __importDefault(require("../utilities/characterUtil.js"));
const gameEngine_js_1 = __importDefault(require("./gameEngine.js"));
const timer_js_1 = __importDefault(require("../utilities/timer.js"));
const empty_mod_js_1 = __importDefault(require("../../mods/empty-mod.js"));
//global.window.Assets = Assets
//import path from 'path'
const options = {
    transparent: false,
    resolution: 1,
    antialias: false,
};
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
pixi_js_1.BaseTexture.defaultOptions.scaleMode = pixi_js_1.SCALE_MODES.NEAREST;
class GameCoordinator {
    mod;
    gameUi;
    rowTop;
    mazeDiv;
    mazeCover;
    mainMenu;
    gameStartButton;
    pauseButton;
    soundButton;
    leftCover;
    rightCover;
    pausedText;
    bottomRow;
    movementButtons;
    maxFps;
    tileSize;
    scale;
    scaledTileSize;
    height;
    width;
    maze;
    mazeArray;
    firstGame;
    movementKeys;
    fruitPoints;
    emitter;
    soundManager;
    eyeGhosts;
    ghostCombo;
    am;
    mazeSprite;
    stage;
    remainingSources;
    activeTimers;
    points = 0;
    level = 1;
    lives = 2;
    extraLifeGiven = false;
    remainingDots = 0;
    allowKeyPresses = true;
    allowPacmanMovement = false;
    allowPause = false;
    cutscene = true;
    highScore;
    pacman;
    blinky;
    pinky;
    inky;
    clyde;
    fruit;
    entityList;
    ghosts;
    scaredGhosts;
    idleGhosts;
    pickups;
    gameEngine;
    renderer;
    ghostCycleTimer;
    endIdleTimer;
    fruitTimer;
    ghostFlashTimer;
    topRender;
    bottomRender;
    view;
    constructor() {
        //super(options)
        this.mod = new empty_mod_js_1.default(this);
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
        const mm = new mazeManagert_js_1.default();
        this.maze = mm.get("maze1");
        this.mazeArray = this.maze.mazeArray;
        this.maxFps = 120;
        this.tileSize = 8;
        this.scale = this.determineScale(1);
        //this.scaledTileSize = this.tileSize * this.scale;
        this.scaledTileSize = this.tileSize * 1;
        this.height = this.scaledTileSize * 31;
        this.width = this.scaledTileSize * 28;
        this.maze.setDimensions(this.width, this.height);
        //PIXI
        window['PIXI'] = PIXI;
        this.firstGame = true;
        this.createUi();
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
        this.gameStartButton.addEventListener('click', this.startButtonClick.bind(this));
        this.pauseButton.addEventListener('click', this.handlePauseKey.bind(this));
        this.soundButton.addEventListener('click', this.soundButtonClick.bind(this));
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
    setMod(mod) {
        this.mod = mod;
    }
    /**
     * Recursive method which determines the largest possible scale the game's graphics can use
     * @param {Number} scale
     */
    determineScale(scale) {
        const availableScreenHeight = Math.min(document.documentElement.clientHeight, window.innerHeight || 0);
        const availableScreenWidth = Math.min(document.documentElement.clientWidth, window.innerWidth || 0);
        const scaledTileSize = this.tileSize * scale;
        // The original Pac-Man game leaves 5 tiles of height (3 above, 2 below) surrounding the
        // maze for the UI. See app\style\graphics\spriteSheets\references\mazeGridSystemReference.png
        // for reference.
        const mazeTileHeight = this.mazeArray.length + 5;
        const mazeTileWidth = this.mazeArray[0][0].split('').length;
        if (scaledTileSize * mazeTileHeight < availableScreenHeight
            && scaledTileSize * mazeTileWidth < availableScreenWidth) {
            return this.determineScale(scale + 1);
        }
        return scale - 1;
    }
    /**
     * Reveals the game underneath the loading covers and starts gameplay
     */
    startButtonClick() {
        this.leftCover.style.left = '-50%';
        this.rightCover.style.right = '-50%';
        this.mainMenu.style.opacity = "0";
        this.gameStartButton.disabled = true;
        setTimeout(() => {
            this.mainMenu.style.visibility = 'hidden';
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
    setSoundButtonIcon(newVolume) {
        this.soundButton.innerHTML = newVolume === 0 ? 'volume_off' : 'volume_up';
    }
    /**
     * Displays an error message in the event assets are unable to download
     */
    displayErrorMessage() {
        const loadingContainer = document.getElementById('loading-container');
        const errorMessage = document.getElementById('error-message');
        loadingContainer.style.opacity = "0";
        setTimeout(() => {
            loadingContainer.remove();
            errorMessage.style.opacity = 1 + "";
            errorMessage.style.visibility = 'visible';
        }, 1500);
    }
    /**
     * Load all assets into a hidden Div to pre-load them into memory.
     */
    async preloadAssets() {
        this.am = new assetsManager_js_1.default(this);
        await this.am.load();
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
            this.pacman = new pacman_js_1.default(this, new characterUtil_js_1.default());
            this.blinky = new ghost_js_1.default(this, 'blinky', this.level, new characterUtil_js_1.default());
            this.pinky = new ghost_js_1.default(this, 'pinky', this.level, new characterUtil_js_1.default());
            this.inky = new ghost_js_1.default(this, 'inky', this.level, new characterUtil_js_1.default(), this.blinky);
            this.clyde = new ghost_js_1.default(this, 'clyde', this.level, new characterUtil_js_1.default());
            this.fruit = new pickup_js_1.default('fruit', 13.5, 17, 100, this);
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
            this.pickups.forEach(p => {
                //@ts-ignore
                this.stage.addChild(p.sprite);
            });
            //@ts-ignore
            this.stage.addChild(this.pacman.sprite);
            //@ts-ignore
            this.stage.addChild(this.pacman.spriteArrow);
            this.ghosts.forEach(g => {
                //@ts-ignore
                this.stage.addChild(g.sprite);
            });
            this.soundManager = new soundManager_js_1.default();
            this.setUiDimensions();
        }
        else {
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
        this.updatePoints();
        this.updateHightScore();
        this.clearDisplay("fruitsDisplay");
        const vp = localStorage.getItem('volumePreference');
        const volumePreference = vp ? Number(vp) : 1;
        this.setSoundButtonIcon(volumePreference);
        this.soundManager.setMasterVolume(volumePreference);
    }
    /**
     * Calls necessary setup functions to start the game
     */
    init() {
        //initialize the current mod values    
        this.registerEventListeners();
        this.mod.initialize();
        this.gameEngine = new gameEngine_js_1.default(this, this.maxFps, this.entityList);
        this.gameEngine.start();
    }
    /**
     * Adds HTML elements to draw on the webpage by iterating through the 2D maze array
     * @param {Array} mazeArray - 2D array representing the game board
     * @param {Array} entityList - List of entities to be used throughout the game
     */
    drawMaze(mazeArray, entityList) {
        this.pickups = [this.fruit];
        this.mazeDiv.style.height = `${this.height * this.scale}px`;
        this.mazeDiv.style.width = `${this.width * this.scale}px`;
        this.gameUi.style.width = `${this.width * this.scale}px`;
        this.bottomRow.style.minHeight = `${this.scaledTileSize * 2}px`;
        mazeArray.forEach((row, rowIndex) => {
            row.forEach((block, columnIndex) => {
                if (block === 'o' || block === 'O') {
                    const type = block === 'o' ? 'pacdot' : 'powerPellet';
                    const points = block === 'o' ? 10 : 50;
                    const dot = new pickup_js_1.default(type, columnIndex, rowIndex, points, this);
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
        });
        this.topRender.update();
        this.bottomRender = new RendererBottom(this, {
            backgroundColor: 0x0000ff,
            width: this.width * this.scale,
            height: this.height * 0.06 * this.scale
        });
        this.bottomRender.update();
        //canvas view     
        this.view = document.createElement("canvas");
        this.view.width = (this.tileSize * 28) * this.scale;
        this.view.height = (this.tileSize * 31) * this.scale;
        this.mazeDiv.appendChild(this.view);
        this.view.classList.add("view");
        this.stage = new pixi_js_1.Container();
        this.stage.sortableChildren = true;
        this.stage.scale.set(this.scale);
        const opts = {
            view: this.view,
            width: this.view.width,
            height: this.view.height
        };
        for (let opt in options)
            //@ts-ignore
            opts[opt] = options[opt];
        this.renderer = new PIXI.Renderer(opts);
    }
    setUiDimensions() {
        this.gameUi.style.fontSize = `${this.scaledTileSize}px`;
        this.rowTop.style.marginBottom = `${this.scaledTileSize}px`;
    }
    render() {
        //super.render()
        this.renderer.render(this.stage);
        if (this.topRender)
            this.topRender.render(this.topRender.container);
        if (this.bottomRender)
            this.bottomRender.render(this.bottomRender.container);
    }
    /**
     * Loop which periodically checks which pickups are nearby Pacman.
     * Pickups which are far away will not be considered for collision detection.
     */
    collisionDetectionLoop() {
        if (this.pacman.position) {
            const maxDistance = this.pacman.velocityPerMs * 750;
            const pacmanCenter = {
                x: this.pacman.position.x + this.scaledTileSize,
                y: this.pacman.position.y + this.scaledTileSize,
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
    startGameplay(initialStart) {
        if (initialStart) {
            this.soundManager.play('game_start');
        }
        this.scaredGhosts = [];
        this.eyeGhosts = 0;
        this.allowPacmanMovement = false;
        const x = this.scaledTileSize * 11;
        const y = this.scaledTileSize * 16.5;
        const duration = initialStart ? 4500 : 2000;
        const width = this.scaledTileSize * 6;
        const height = this.scaledTileSize * 2;
        this.displayText({ x, y }, 'ready', duration, width, height);
        this.updateExtraLivesDisplay();
        new timer_js_1.default(() => {
            //for mods. start the mod 
            this.mod.start();
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
            this.emitter.emit("post-start");
        }, duration);
    }
    /**
     * Clears out all children nodes from a given display element
     * @param {String} displayName
     */
    clearDisplay(displayName) {
        const display = this.bottomRender.container.getChildByName(displayName);
        //@ts-ignore
        if (display)
            display.children.length = 0;
    }
    updatePoints() {
        this.topRender.update();
    }
    updateHightScore() {
        this.topRender.update();
    }
    /**
     * Displays extra life images equal to the number of remaining lives
     */
    updateExtraLivesDisplay() {
        this.clearDisplay("livesDisplay");
        const livesDisplay = this.bottomRender.container.getChildByName("livesDisplay");
        let tx = this.am.getTexture("extra_life");
        for (let i = 0; i < this.lives; i += 1) {
            let extraLifeSprite = new pixi_js_1.Sprite(tx);
            extraLifeSprite.x = extraLifeSprite.width * i;
            //@ts-ignore
            livesDisplay.addChild(extraLifeSprite);
        }
    }
    /**
     * Displays a rolling log of the seven most-recently eaten fruit
     * @param {number} points
     */
    updateFruitsDisplay(points) {
        const name = this.fruit.getFruitName(points);
        const fruitsDisplay = this.bottomRender.container.getChildByName("fruitsDisplay");
        //@ts-ignore
        if (fruitsDisplay.length == 7) {
            //@ts-ignore
            const first = fruitsDisplay.getChildAt(0);
            if (first)
                fruitsDisplay.removeChild(first);
        }
        const fruitSp = new pixi_js_1.Sprite(this.am.getTexture(name));
        let x = 0;
        //@ts-ignore
        fruitsDisplay.children.forEach(f => x += f.width);
        x += fruitSp.width;
        fruitSp.position.x = this.width - x;
        //@ts-ignore
        fruitsDisplay.addChild(fruitSp);
    }
    /**
     * Cycles the ghosts between 'chase' and 'scatter' mode
     * @param {('chase'|'scatter')} mode
     */
    ghostCycle(mode) {
        const delay = mode === 'scatter' ? 7000 : 20000;
        const nextMode = mode === 'scatter' ? 'chase' : 'scatter';
        this.ghostCycleTimer = new timer_js_1.default(() => {
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
            this.endIdleTimer = new timer_js_1.default(() => {
                this.idleGhosts[0].endIdleMode();
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
        this.emitter = new eventemitter3_1.default();
        this.entityList.forEach((e) => {
            e.emitter = this.emitter;
            e.registerEventListeners();
        });
        this.emitter.on("start", this.startGameplay.bind(this));
        this.emitter.on("advance-level", this.advanceLevel.bind(this));
        this.emitter.on("speed-up-blinky", this.speedUpBlinky.bind(this));
        this.emitter.on("create-fruit", this.createFruit.bind(this));
        this.emitter.on("game-over", this.gameOver.bind(this));
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
                .getElementById(`button-${direction}`)
                .addEventListener('touchstart', () => {
                this.changeDirection(direction);
            });
        });
    }
    /**
     * Calls Pacman's changeDirection event if certain conditions are met
     * @param {({'up'|'down'|'left'|'right'})} direction
     */
    changeDirection(direction) {
        if (this.allowKeyPresses && this.gameEngine.running) {
            this.pacman.changeDirection(direction, this.allowPacmanMovement);
        }
    }
    /**
     * Calls various class functions depending upon the pressed key
     * @param {Event} e - The keydown event to evaluate
     */
    handleKeyDown(e) {
        if (e.keyCode === 27) {
            // ESC key
            this.handlePauseKey();
        }
        else if (e.keyCode === 81) {
            // Q
            this.soundButtonClick();
        }
        else if (this.movementKeys[e.keyCode]) {
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
            }
            else {
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
    awardPoints(e) {
        this.points += e.detail.points;
        this.updatePoints();
        if (this.points > (Number(this.highScore) || 0)) {
            this.highScore = this.points.toString();
            this.updateHightScore();
            localStorage.setItem('highScore', this.highScore);
        }
        if (this.points >= 10000 && !this.extraLifeGiven) {
            this.extraLifeGiven = true;
            this.soundManager.play('extra_life');
            this.lives += 1;
            this.updateExtraLivesDisplay();
        }
        if (e.detail.type === 'fruit') {
            const x = e.detail.points >= 1000
                ? this.scaledTileSize * 12.5
                : this.scaledTileSize * 13;
            const y = this.scaledTileSize * 16.5;
            const width = e.detail.points >= 1000
                ? this.scaledTileSize * 3
                : this.scaledTileSize * 2;
            const height = this.scaledTileSize * 2;
            this.displayText({ x: x, y: y }, e.detail.points, 2000, width, height);
            this.soundManager.play('fruit');
            this.updateFruitsDisplay(e.detail.points);
        }
    }
    /**
     * Animates Pacman's death, subtracts a life, and resets character positions if
     * the player has remaining lives.
     */
    /**
     * Changed to suport events details values to change the behavior of this method
     */
    deathSequence(event) {
        this.allowPause = false;
        this.cutscene = true;
        this.soundManager.setCutscene(this.cutscene);
        this.soundManager.stopAmbience();
        this.removeTimer({ detail: { timer: this.fruitTimer } });
        this.removeTimer({ detail: { timer: this.ghostCycleTimer } });
        this.removeTimer({ detail: { timer: this.endIdleTimer } });
        this.removeTimer({ detail: { timer: this.ghostFlashTimer } });
        this.allowKeyPresses = false;
        this.pacman.moving = false;
        this.ghosts.forEach((ghost) => {
            const ghostRef = ghost;
            ghostRef.moving = false;
        });
        new timer_js_1.default(() => {
            this.ghosts.forEach((ghost) => {
                const ghostRef = ghost;
                ghostRef.display = false;
            });
            this.pacman.prepDeathAnimation();
            this.soundManager.play('death');
            if (this.lives > 0) {
                this.lives -= 1;
                let callbackAfter = (event?.detail?.callbackAfter);
                if (callbackAfter)
                    callbackAfter();
                new timer_js_1.default(() => {
                    this.emitter.emit("post-death");
                    this.mazeCover.style.visibility = 'visible';
                    new timer_js_1.default(() => {
                        this.allowKeyPresses = true;
                        this.mazeCover.style.visibility = 'hidden';
                        this.pacman.reset();
                        this.ghosts.forEach((ghost) => {
                            ghost.reset();
                        });
                        this.fruit.hideFruit();
                        let shouldRestart = (event?.detail?.restart) === undefined ? true : (event.detail.restart);
                        if (shouldRestart)
                            this.emitter.emit("start");
                    }, 500);
                }, 2250);
            }
            else {
                this.emitter.emit("game-over");
            }
        }, 750);
    }
    /**
     * Displays GAME OVER text and displays the menu so players can play again
     */
    gameOver() {
        localStorage.setItem('highScore', this.highScore);
        new timer_js_1.default(() => {
            //for mods
            this.mod.stop();
            this.displayText({
                x: this.scaledTileSize * 9,
                y: this.scaledTileSize * 16.5,
            }, 'game_over', 4000, this.scaledTileSize * 10, this.scaledTileSize * 2);
            this.fruit.hideFruit();
            new timer_js_1.default(() => {
                this.leftCover.style.left = '0';
                this.rightCover.style.right = '0';
                setTimeout(() => {
                    this.mainMenu.style.opacity = "1";
                    this.gameStartButton.disabled = false;
                    this.mainMenu.style.visibility = 'visible';
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
            this.emitter.emit("create-fruit");
        }
        if (this.remainingDots === 40 || this.remainingDots === 20) {
            this.emitter.emit("speed-up-blinky");
        }
        if (this.remainingDots === 0) {
            this.emitter.emit("advance-level");
        }
    }
    /**
     * Creates a bonus fruit for ten seconds
     */
    createFruit() {
        this.removeTimer({ detail: { timer: this.fruitTimer } });
        this.fruit.showFruit(this.fruitPoints[this.level] || 5000);
        this.fruitTimer = new timer_js_1.default(() => {
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
    determineSiren(remainingDots) {
        let sirenNum;
        if (remainingDots > 40) {
            sirenNum = 1;
        }
        else if (remainingDots > 20) {
            sirenNum = 2;
        }
        else {
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
        this.mod.stop();
        this.entityList.forEach((entity) => {
            const entityRef = entity;
            entityRef.moving = false;
        });
        this.removeTimer({ detail: { timer: this.fruitTimer } });
        this.removeTimer({ detail: { timer: this.ghostCycleTimer } });
        this.removeTimer({ detail: { timer: this.endIdleTimer } });
        this.removeTimer({ detail: { timer: this.ghostFlashTimer } });
        new timer_js_1.default(() => {
            this.ghosts.forEach((ghost) => {
                const ghostRef = ghost;
                ghostRef.display = false;
            });
            this.mazeSprite.texture = pixi_js_1.Texture.from("maze_white");
            new timer_js_1.default(() => {
                this.mazeSprite.texture = pixi_js_1.Texture.from("maze_blue");
                new timer_js_1.default(() => {
                    this.mazeSprite.texture = pixi_js_1.Texture.from("maze_white");
                    new timer_js_1.default(() => {
                        this.mazeSprite.texture = pixi_js_1.Texture.from("maze_blue");
                        new timer_js_1.default(() => {
                            this.mazeSprite.texture = pixi_js_1.Texture.from("maze_white");
                            new timer_js_1.default(() => {
                                this.mazeSprite.texture = pixi_js_1.Texture.from("maze_blue");
                                new timer_js_1.default(() => {
                                    this.mazeSprite.visible = false;
                                    new timer_js_1.default(() => {
                                        this.mazeSprite.visible = true;
                                        this.mazeCover.style.visibility = 'hidden';
                                        this.level += 1;
                                        this.allowKeyPresses = true;
                                        this.entityList.forEach((entity) => {
                                            const entityRef = entity;
                                            if (entityRef.level) {
                                                entityRef.level = this.level;
                                            }
                                            entityRef.reset();
                                            if (entityRef instanceof ghost_js_1.default) {
                                                entityRef.resetDefaultSpeed();
                                            }
                                            if (entityRef instanceof pickup_js_1.default
                                                && entityRef.type !== 'fruit') {
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
    flashGhosts(flashes, maxFlashes) {
        if (flashes === maxFlashes) {
            this.scaredGhosts.forEach((ghost) => {
                ghost.endScared();
            });
            this.scaredGhosts = [];
            if (this.eyeGhosts === 0) {
                this.soundManager.setAmbience(this.determineSiren(this.remainingDots));
            }
        }
        else if (this.scaredGhosts.length > 0) {
            this.scaredGhosts.forEach((ghost) => {
                ghost.toggleScaredColor();
            });
            this.ghostFlashTimer = new timer_js_1.default(() => {
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
        this.removeTimer({ detail: { timer: this.ghostFlashTimer } });
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
        this.ghostFlashTimer = new timer_js_1.default(() => {
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
    eatGhost(e) {
        const pauseDuration = 1000;
        const { position, measurement } = e.detail.ghost;
        this.pauseTimer({ detail: { timer: this.ghostFlashTimer } });
        this.pauseTimer({ detail: { timer: this.ghostCycleTimer } });
        this.pauseTimer({ detail: { timer: this.fruitTimer } });
        this.soundManager.play('eat_ghost');
        this.scaredGhosts = this.scaredGhosts.filter(ghost => ghost.name !== e.detail.ghost.name);
        this.eyeGhosts += 1;
        this.ghostCombo += 1;
        const comboPoints = this.determineComboPoints();
        window.dispatchEvent(new CustomEvent('awardPoints', {
            detail: {
                points: comboPoints,
            },
        }));
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
        new timer_js_1.default(() => {
            this.soundManager.setAmbience('eyes');
            this.resumeTimer({ detail: { timer: this.ghostFlashTimer } });
            this.resumeTimer({ detail: { timer: this.ghostCycleTimer } });
            this.resumeTimer({ detail: { timer: this.fruitTimer } });
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
    displayText(position, amount, duration, width, height) {
        let textSp;
        const texture = this.am.getTexture(amount);
        if (texture)
            textSp = new pixi_js_1.Sprite(texture);
        else
            textSp = new pixi_js_1.Text(amount, {
                fontFamily: "Press Start 2P",
                fontSize: 6,
                fill: 0xffffff
            });
        textSp.width = width;
        textSp.height = height || width;
        textSp.position.set(position.x, position.y);
        this.stage.addChild(textSp);
        new timer_js_1.default(() => {
            this.stage.removeChild(textSp);
        }, duration);
    }
    /**
     * Pushes a Timer to the activeTimers array
     * @param {({ detail: { timer: Object }})} e
     */
    addTimer(e) {
        this.activeTimers.push(e.detail.timer);
    }
    /**
     * Checks if a Timer with a matching ID exists
     * @param {({ detail: { timer: Object }})} e
     * @returns {Boolean}
     */
    timerExists(e) {
        return !!(e.detail.timer || {}).timerId;
    }
    /**
     * Pauses a timer
     * @param {({ detail: { timer: Object }})} e
     */
    pauseTimer(e) {
        if (this.timerExists(e)) {
            e.detail.timer.pause(true);
        }
    }
    /**
     * Resumes a timer
     * @param {({ detail: { timer: Object }})} e
     */
    resumeTimer(e) {
        if (this.timerExists(e)) {
            e.detail.timer.resume(true);
        }
    }
    /**
     * Removes a Timer from activeTimers
     * @param {({ detail: { timer: Object }})} e
     */
    removeTimer(e) {
        if (this.timerExists(e)) {
            window.clearTimeout(e.detail.timer.timerId);
            this.activeTimers = this.activeTimers.filter(timer => timer.timerId !== e.detail.timer.timerId);
        }
    }
}
// removeIf(production)
exports.default = GameCoordinator;
// endRemoveIf(production)
class RendererTop extends PIXI.Renderer {
    container = new pixi_js_1.Container();
    player1Label;
    points;
    highScoreLabel;
    highScore;
    gc;
    constructor(gameCoordinator, options) {
        super(options);
        this.gc = gameCoordinator;
        const textStyle = {
            fontFamily: "Press Start 2P, sans-serif",
            fontSize: 8,
            //fontWeight: "bold",
            fill: "0xffffff",
        };
        this.player1Label = new pixi_js_1.Text("", textStyle);
        this.points = new pixi_js_1.Text("", textStyle);
        this.highScoreLabel = new pixi_js_1.Text("", textStyle);
        this.highScore = new pixi_js_1.Text("", textStyle);
        this.container.addChild(this.player1Label, this.points, this.highScoreLabel, this.highScore);
        this.initialize();
    }
    initialize() {
        //@ts-ignore
        //this.view.classList.add("row-top-view")
        //@ts-ignore
        this.gc.rowTop.appendChild(this.view);
        this.container.scale.set(this.gc.scale);
    }
    update() {
        this.player1Label.text = "";
        this.player1Label.style.align = "left";
        this.player1Label.text = "1UP";
        this.points.text = "";
        this.points.text = this.gc.points;
        this.points.style.align = "right";
        this.highScoreLabel.style.align = "center";
        this.highScoreLabel.text = "";
        this.highScoreLabel.text = "HIGH SCORE";
        this.highScore.style.align = "center";
        this.highScore.text = this.gc.highScore ? this.gc.highScore : 0;
        let x = 0, y = 2;
        //text.scale.set(0.333) 
        x = this.gc.width * 0.10 - this.player1Label.width * 0.5;
        this.player1Label.position.set(x, y);
        const line2y = this.view.height / (2 * this.gc.scale) * 0.9;
        y = line2y;
        x = this.gc.width * 0.20 - this.points.width * 0.5;
        this.points.position.set(x, y);
        //text.scale.set(0.333)
        x = this.gc.width * 0.50 - this.highScoreLabel.width * 0.5;
        y = 2;
        this.highScoreLabel.position.set(x, y);
        x = this.gc.width * 0.50 - this.highScore.width * 0.5;
        y = line2y;
        this.highScore.position.set(x, y);
    }
}
class RendererBottom extends PIXI.Renderer {
    gc;
    container = new pixi_js_1.Container();
    constructor(gameCoordinator, options) {
        super(options);
        this.gc = gameCoordinator;
        //@ts-ignore
        //   this.view.classList.add("row-bottom-view")
        this.container.scale.set(this.gc.scale);
        const livesDisplay = new pixi_js_1.Container();
        livesDisplay.name = "livesDisplay";
        this.container.addChild(livesDisplay);
        const fruitsDisplay = new pixi_js_1.Container();
        fruitsDisplay.name = "fruitsDisplay";
        fruitsDisplay.x = this.container.width;
        this.container.addChild(fruitsDisplay);
        //@ts-ignore
        this.gc.bottomRow.appendChild(this.view);
    }
    update() {
    }
}