import StaticEntity from "../characters/staticEntity.ts";
import GameCoordinator from "./gameCoordinator.ts";
declare class GameEngine {
    gameCoordinator: any;
    lastFpsUpdate: number;
    fps: number;
    framesThisSecond: number;
    fpsDisplay: any;
    elapsedMs: number;
    lastFrameTimeMs: number;
    entityList: StaticEntity[];
    maxFps: number;
    timestep: number;
    frameId: number;
    running: boolean;
    started: boolean;
    constructor(gameCoordinator: GameCoordinator, maxFps: number, entityList: StaticEntity[]);
    /**
     * Toggles the paused/running status of the game
     * @param {Boolean} running - Whether the game is currently in motion
     */
    changePausedState(running: any): void;
    /**
     * Updates the on-screen FPS counter once per second
     * @param {number} timestamp - The amount of MS which has passed since starting the game engine
     */
    updateFpsDisplay(timestamp: number): void;
    /**
     * Calls the draw function for every member of the entityList
     * @param {number} interp - The animation accuracy as a percentage
     * @param {Array} entityList - List of entities to be used throughout the game
     */
    draw(interp: number, entityList: any[]): void;
    /**
     * Calls the update function for every member of the entityList
     * @param {number} elapsedMs - The amount of MS that have passed since the last update
     * @param {Array} entityList - List of entities to be used throughout the game
     */
    update(elapsedMs: any, entityList: any[]): void;
    /**
     * In the event that a ton of unsimulated frames pile up, discard all of these frames
     * to prevent crashing the game
     */
    panic(): void;
    /**
     * Draws an initial frame, resets a few tracking variables related to animation, and calls
     * the mainLoop function to start the engine
     */
    start(): void;
    /**
     * Stops the engine and cancels the current animation frame
     */
    stop(): void;
    /**
     * The loop which will process all necessary frames to update the game's entities
     * prior to animating them
     */
    processFrames(): void;
    /**
     * A single cycle of the engine which checks to see if enough time has passed, and, if so,
     * will kick off the loops to update and draw the game's entities.
     * @param {number} timestamp - The amount of MS which has passed since starting the game engine
     */
    engineCycle(timestamp: number): void;
    /**
     * The endless loop which will kick off engine cycles so long as the game is running
     * @param {number} timestamp - The amount of MS which has passed since starting the game engine
     */
    mainLoop(timestamp: number): void;
}
export default GameEngine;
//# sourceMappingURL=gameEngine.d.ts.map