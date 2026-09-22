import { Sprite, Container, Text } from "pixi.js";
import * as PIXI from 'pixi.js';
import EventEmitter from "eventemitter3";
import Maze from "../mazes/maze.ts";
import SoundManager from "../utilities/soundManager.ts";
import AssetsManager from "./assetsManager.ts";
import Ghost from "../characters/ghost.ts";
import Pacman from "../characters/pacman.ts";
import Pickup from "../pickups/pickup.ts";
import StaticEntity from "../characters/staticEntity.ts";
import GameEngine from "./gameEngine.ts";
import Timer from "../utilities/timer.ts";
import Mod from "../../mods/mod.ts";
import { Mode } from "../characters/types.ts";
declare class GameCoordinator {
    mod: Mod;
    gameUi: any;
    rowTop: any;
    mazeDiv: any;
    mazeCover: any;
    mainMenu: HTMLElement | null;
    gameStartButton: any;
    pauseButton: any;
    soundButton: any;
    leftCover: any;
    rightCover: any;
    pausedText: any;
    bottomRow: any;
    movementButtons: any;
    maxFps: number;
    tileSize: number;
    scale: number;
    scaledTileSize: number;
    height: number;
    width: number;
    maze: Maze | undefined;
    mazeArray: any;
    firstGame: boolean;
    movementKeys: any;
    fruitPoints: any;
    emitter: EventEmitter;
    soundManager: SoundManager;
    eyeGhosts: number;
    ghostCombo: number;
    am: AssetsManager;
    mazeSprite: Sprite;
    stage: Container;
    remainingSources: number;
    activeTimers: Timer[];
    points: number;
    level: number;
    lives: number;
    extraLifeGiven: boolean;
    remainingDots: number;
    allowKeyPresses: boolean;
    allowPacmanMovement: boolean;
    allowPause: boolean;
    cutscene: boolean;
    highScore: string | null;
    pacman: Pacman;
    blinky: Ghost;
    pinky: Ghost;
    inky: Ghost;
    clyde: Ghost;
    fruit: Pickup;
    entityList: StaticEntity[];
    ghosts: Ghost[];
    scaredGhosts: Ghost[];
    idleGhosts: Ghost[];
    pickups: Pickup[];
    gameEngine: GameEngine;
    renderer: PIXI.Renderer;
    ghostCycleTimer: Timer;
    endIdleTimer: Timer;
    fruitTimer: Timer;
    ghostFlashTimer: Timer;
    topRender: RendererTop;
    bottomRender: RendererBottom;
    view: any;
    debug: boolean;
    constructor();
    /**
     * Included to accpet a new mod to the game
     * @param {Mod} mod
     */
    setMod(mod: Mod): void;
    /**
     * Recursive method which determines the largest possible scale the game's graphics can use
     * @param {Number} scale
     */
    determineScale(scale: number): number;
    /**
     * Reveals the game underneath the loading covers and starts gameplay
     */
    startButtonClick(): void;
    /**
     * Toggles the master volume for the soundManager, and saves the preference to storage
     */
    soundButtonClick(): void;
    /**
     * Sets the icon for the sound button
     */
    setSoundButtonIcon(newVolume: number): void;
    /**
     * Displays an error message in the event assets are unable to download
     */
    displayErrorMessage(): void;
    /**
     * Load all assets into a hidden Div to pre-load them into memory.
     */
    preloadAssets(): Promise<void>;
    /**
     * Resets gameCoordinator values to their default states
     */
    reset(): void;
    /**
     * Calls necessary setup functions to start the game
     */
    init(): void;
    /**
     * Adds HTML elements to draw on the webpage by iterating through the 2D maze array
     * @param {Array} mazeArray - 2D array representing the game board
     */
    drawMaze(mazeArray: any): void;
    createUi(): void;
    setUiDimensions(): void;
    render(): void;
    /**
     * Loop which periodically checks which pickups are nearby Pacman.
     * Pickups which are far away will not be considered for collision detection.
     */
    collisionDetectionLoop(): void;
    /**
     * Displays "Ready!" and allows Pacman to move after a breif delay
     * @param {Boolean} initialStart - Special condition for the game's beginning
     */
    startGameplay(initialStart?: boolean): void;
    /**
     * Clears out all children nodes from a given display element
     * @param {String} displayName
     */
    clearDisplay(displayName: string): void;
    updatePoints(): void;
    updateHightScore(): void;
    /**
     * Displays extra life images equal to the number of remaining lives
     */
    updateExtraLivesDisplay(): void;
    /**
     * Displays a rolling log of the seven most-recently eaten fruit
     * @param {number} points
     */
    updateFruitsDisplay(points: number): void;
    /**
     * Cycles the ghosts between 'chase' and 'scatter' mode
     * @param {('chase'|'scatter')} mode
     */
    ghostCycle(mode: Mode): void;
    /**
     * Releases a ghost from the Ghost House after a delay
     */
    releaseGhost(): void;
    /**
     * Register listeners for various game sequences
     */
    registerEventListeners(): void;
    /**
     * Calls Pacman's changeDirection event if certain conditions are met
     * @param {({'up'|'down'|'left'|'right'})} direction
     */
    changeDirection(direction: string): void;
    /**
     * Calls various class functions depending upon the pressed key
     * @param {Event} e - The keydown event to evaluate
     */
    handleKeyDown(e: KeyboardEvent): void;
    /**
     * Handle behavior for the pause key
     */
    handlePauseKey(): void;
    /**
     * Adds points to the player's total
     * @param {({ detail: { points: Number }})} e - Contains a quantity of points to add
     */
    awardPoints(e: CustomEvent): void;
    /**
     * Animates Pacman's death, subtracts a life, and resets character positions if
     * the player has remaining lives.
     */
    /**
     * Changed to suport events details values to change the behavior of this method
     */
    deathSequence(event: CustomEvent): void;
    /**
     * Displays GAME OVER text and displays the menu so players can play again
     */
    gameOver(): void;
    /**
     * Handle events related to the number of remaining dots
     */
    dotEaten(): void;
    /**
     * Creates a bonus fruit for ten seconds
     */
    createFruit(): void;
    /**
     * Speeds up Blinky and raises the background noise pitch
     */
    speedUpBlinky(): void;
    /**
     * Determines the correct siren ambience
     * @param {Number} remainingDots
     * @returns {String}
     */
    determineSiren(remainingDots: number): string;
    /**
     * Resets the gameboard and prepares the next level
     */
    advanceLevel(): void;
    /**
     * Flashes ghosts blue and white to indicate the end of the powerup
     * @param {Number} flashes - Total number of elapsed flashes
     * @param {Number} maxFlashes - Total flashes to show
     */
    flashGhosts(flashes: number, maxFlashes: number): void;
    /**
     * Upon eating a power pellet, sets the ghosts to 'scared' mode
     */
    powerUp(): void;
    /**
     * Determines the quantity of points to give based on the current combo
     */
    determineComboPoints(): number;
    /**
     * Upon eating a ghost, award points and temporarily pause movement
     * @param {detail} detail - Contains a target ghost object
     */
    eatGhost(detail: any): void;
    /**
     * Decrements the count of "eye" ghosts and updates the ambience
     */
    restoreGhost(): void;
    /**
     * Creates a temporary div to display points on screen
     * @param {({ left: number, top: number })} position - CSS coordinates to display the points at
     * @param {Number} amount - Amount of points to display
     * @param {Number} duration - Milliseconds to display the points before disappearing
     * @param {Number} width - Image width in pixels
     * @param {Number} height - Image height in pixels
     */
    displayText(position: PIXI.ObservablePoint, amount: any, duration: number, width: number, height?: number, offset?: { x?: number, y?: number }): void;
    /**
     * Pushes a Timer to the activeTimers array
     * @param {({ detail: { timer: Object }})} e
     */
    addTimer(e: CustomEvent): void;
    /**
     * Checks if a Timer with a matching ID exists
     * @param {({ detail: { timer: Object }})} e
     * @returns {Boolean}
     */
    timerExists(e: CustomEvent): boolean;
    /**
     * Pauses a timer
     * @param {({ detail: { timer: Object }})} e
     */
    pauseTimer(e: CustomEvent): void;
    /**
     * Resumes a timer
     * @param {({ detail: { timer: Object }})} e
     */
    resumeTimer(e: CustomEvent): void;
    /**
     * Removes a Timer from activeTimers
     * @param {({ detail: { timer: Object }})} e
     */
    removeTimer(e: CustomEvent): void;
}
export default GameCoordinator;
declare class RendererTop extends PIXI.Renderer {
    container: Container;
    player1Label: Text;
    points: Text;
    highScoreLabel: Text;
    highScore: Text;
    gc: GameCoordinator;
    constructor(gameCoordinator: GameCoordinator, options: PIXI.IRendererOptions);
    private initialize;
    update(): void;
}
declare class RendererBottom extends PIXI.Renderer {
    gc: GameCoordinator;
    container: Container<PIXI.DisplayObject>;
    constructor(gameCoordinator: GameCoordinator, options: PIXI.IRendererOptions);
    update(): void;
}
//# sourceMappingURL=gameCoordinator.d.ts.map