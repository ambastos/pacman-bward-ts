import { ObservablePoint, Point, Texture } from "pixi.js";
import GameCoordinator from "../core/gameCoordinator.ts";
import CharacterUtil from "../utilities/characterUtil.ts";
import Pacman from "./pacman.ts";
import MovableEntity from "./movableEntity.ts";
import { Mode } from "./types.ts";
declare class Ghost extends MovableEntity {
    pacman: Pacman;
    blinky: Ghost | undefined;
    defaultSpeed: any;
    cruiseElroy: any;
    mode: Mode;
    defaultMode: Mode;
    idleMode: Mode | undefined;
    slowSpeed: number;
    mediumSpeed: number;
    fastSpeed: number;
    scaredSpeed: number;
    transitionSpeed: number;
    eyeSpeed: number;
    velocityPerMs: number;
    emotion: string;
    scaredColor: string;
    defaultDirection: string;
    target: MovableEntity | null;
    constructor(gameCoordinator: GameCoordinator, name: string, level: number, characterUtil: CharacterUtil, blinky?: Ghost);
    /**
     * Rests the character to its default state
     * @param {Boolean} fullGameReset
     */
    reset(fullGameReset?: boolean): void;
    registerEventListeners(): void;
    /**
     * Sets the default mode and idleMode behavior
     */
    setDefaultMode(): void;
    setTarget(target: MovableEntity | null): void;
    /**
     * Sets various properties related to the ghost's movement
     * @param {Object} pacman - Pacman's speed is used as the base for the ghosts' speeds
     * @param {('inky'|'blinky'|'pinky'|'clyde')} name - The name of the current ghost
     */
    setMovementStats(pacman: Pacman, name: string, level: number): void;
    /**
     * Sets values pertaining to the ghost's spritesheet animation
     */
    setSpriteAnimationStats(): void;
    /**
     * Sets css property values for the ghost
     * @param {number} scaledTileSize - The dimensions of a single tile
     * @param {number} spriteFrames - The number of frames in the ghost's spritesheet
     */
    setStyleMeasurements(scaledTileSize: number, spriteFrames: number): void;
    /**
     * Sets the default position and direction for the ghosts at the game's start
     * @param {number} scaledTileSize - The dimensions of a single tile
     * @param {('inky'|'blinky'|'pinky'|'clyde')} name - The name of the current ghost
     */
    setDefaultPosition(scaledTileSize: number, name: string): void;
    /**
     * Chooses a movement Spritesheet depending upon direction
     * @param {('inky'|'blinky'|'pinky'|'clyde')} name - The name of the current ghost
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     */
    setSpriteSheet(name: string, direction: string, mode: string): void;
    getTexture(name: string, direction: string, frameX: number, emotion: string): Texture<import("pixi.js").Resource> | undefined;
    setTexture(name: string, direction: string, frameX: number, emotion: string | null, frameY?: number, width?: number, height?: number): void;
    /**
     * Checks to see if the ghost is currently in the 'tunnels' on the outer edges of the maze
     * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
     * @returns {Boolean}
     */
    isInTunnel(gridPosition: ObservablePoint): boolean;
    /**
     * Checks to see if the ghost is currently in the 'Ghost House' in the center of the maze
     * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
     * @returns {Boolean}
     */
    isInGhostHouse(gridPosition: ObservablePoint | undefined): boolean;
    /**
     * Checks to see if the tile at the given coordinates of the Maze is an open position
     * @param {Array} mazeArray - 2D array representing the game board
     * @param {number} y - The target row
     * @param {number} x - The target column
     * @returns {(false | { x: number, y: number})} - x-y pair if the tile is free, false otherwise
     */
    getTile(mazeArray: [][], y: number, x: number): {
        x: number;
        y: number;
    };
    /**
     * Returns a list of all of the possible moves for the ghost to make on the next turn
     * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {Array} mazeArray - 2D array representing the game board
     * @returns {object}
     */
    determinePossibleMoves(gridPosition: ObservablePoint, direction: string, mazeArray: [][]): any;
    /**
     * Uses the Pythagorean Theorem to measure the distance between a given postion and Pacman
     * @param {({x: number, y: number})} position - An x-y position on the 2D Maze Array
     * @param {({x: number, y: number})} targetPosition - Pacman's current x-y position on the 2D Maze Array
     * @returns {number}
     */
    calculateDistance(position: ObservablePoint, targetPosition?: ObservablePoint): number;
    /**
     * Gets a position a number of spaces in front of Pacman's direction
     * @param {({x: number, y: number})} pacmanGridPosition
     * @param {number} spaces
     */
    getPositionInFrontOfPacman(pacmanGridPosition: ObservablePoint, spaces: number): ObservablePoint;
    /**
     * Determines Pinky's target, which is four tiles in front of Pacman's direction
     * @param {({x: number, y: number})} pacmanGridPosition
     * @returns {({x: number, y: number})}
     */
    determinePinkyTarget(pacmanGridPosition: ObservablePoint): ObservablePoint;
    /**
     * Determines Inky's target, which is a mirror image of Blinky's position
     * reflected across a point two tiles in front of Pacman's direction.
     * Example @ app\style\graphics\spriteSheets\references\inky_target.png
     * @param {({x: number, y: number})} pacmanGridPosition
     * @returns {({x: number, y: number})}
     */
    determineInkyTarget(pacmanGridPosition: ObservablePoint): ObservablePoint;
    /**
     * Clyde targets Pacman when the two are far apart, but retreats to the
     * lower-left corner when the two are within eight tiles of each other
     * @param {({x: number, y: number})} gridPosition
     * @param {({x: number, y: number})} pacmanGridPosition
     * @returns {({x: number, y: number})}
     */
    determineClydeTarget(gridPosition: ObservablePoint, pacmanGridPosition: ObservablePoint): ObservablePoint;
    /**
     * Determines the appropriate target for the ghost's AI in grid coordinates
     * @param {('inky'|'blinky'|'pinky'|'clyde')} name - The name of the current ghost
     * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
     * @param {({x: number, y: number})} pacmanGridPosition - x-y position on the 2D Maze Array
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     * @returns ObservablePoint - Returns the target GRID position(position in tiles)
     */
    getTarget(name: string, gridPosition: ObservablePoint, pacmanGridPosition: ObservablePoint, mode: string): ObservablePoint<Point> | undefined;
    /**
     * Calls the appropriate function to determine the best move depending on the ghost's name
     * @param {('inky'|'blinky'|'pinky'|'clyde')} name - The name of the current ghost
     * @param {Object} possibleMoves - All of the moves the ghost could choose to make this turn
     * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
     * @param {({x: number, y: number})} pacmanGridPosition - x-y position on the 2D Maze Array
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     * @returns {('up'|'down'|'left'|'right')}
     */
    determineBestMove(name: string, possibleMoves: any, gridPosition: ObservablePoint, pacmanGridPosition: ObservablePoint, mode: string): any;
    /**
     * Determines the best direction for the ghost to travel in during the current frame
     * @param {('inky'|'blinky'|'pinky'|'clyde')} name - The name of the current ghost
     * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
     * @param {({x: number, y: number})} pacmanGridPosition - x-y position on the 2D Maze Array
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {Array} mazeArray - 2D array representing the game board
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     * @returns {('up'|'down'|'left'|'right')}
     */
    determineDirection(name: string, gridPosition: ObservablePoint, pacmanGridPosition: ObservablePoint, direction: string, mazeArray: [][], mode: string): any;
    /**
     * Handles movement for idle Ghosts in the Ghost House
     * @param {*} elapsedMs
     * @param {*} position
     * @param {*} velocity
     * @returns {({ top: number, left: number})}
     */
    handleIdleMovement(elapsedMs: number, position: ObservablePoint, velocity: number): ObservablePoint;
    /**
     * Sets idleMode to 'leaving', allowing the ghost to leave the Ghost House
     */
    endIdleMode(): void;
    /**
     * Handle the ghost's movement when it is snapped to the x-y grid of the Maze Array
     * @param {number} elapsedMs - The amount of MS that have passed since the last update
     * @param {({x: number, y: number})} gridPosition - x-y position during the current frame
     * @param {number} velocity - The distance the character should travel in a single millisecond
     * @param {({x: number, y: number})} pacmanGridPosition - x-y position on the 2D Maze Array
     * @returns {({ top: number, left: number})}
     */
    handleSnappedMovement(elapsedMs: number, gridPosition: ObservablePoint, velocity: number, pacmanGridPosition: ObservablePoint): ObservablePoint;
    /**
     * Determines if an eaten ghost is at the entrance of the Ghost House
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     * @param {({x: number, y: number})} position - x-y position during the current frame
     * @returns {Boolean}
     */
    enteringGhostHouse(mode: string, position: ObservablePoint): boolean;
    /**
     * Determines if an eaten ghost has reached the center of the Ghost House
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     * @param {({x: number, y: number})} position - x-y position during the current frame
     * @returns {Boolean}
     */
    enteredGhostHouse(mode: string, position: ObservablePoint): boolean;
    /**
     * Determines if a restored ghost is at the exit of the Ghost House
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     * @param {({x: number, y: number})} position - x-y position during the current frame
     * @returns {Boolean}
     */
    leavingGhostHouse(mode: string, position: ObservablePoint): boolean;
    /**
     * Handles entering and leaving the Ghost House after a ghost is eaten
     * @param {({x: number, y: number})} gridPosition - x-y position during the current frame
     * @returns {({x: number, y: number})}
     */
    handleGhostHouse(gridPosition: ObservablePoint): ObservablePoint;
    /**
     * Handle the ghost's movement when it is inbetween tiles on the x-y grid of the Maze Array
     * @param {number} elapsedMs - The amount of MS that have passed since the last update
     * @param {({x: number, y: number})} gridPosition - x-y position during the current frame
     * @param {number} velocity - The distance the character should travel in a single millisecond
     * @returns {({ top: number, left: number})}
     */
    handleUnsnappedMovement(elapsedMs: number, gridPosition: ObservablePoint, velocity: number): any;
    /**
     * Determines the new Ghost position
     * @param {number} elapsedMs
     * @returns {({ top: number, left: number})}
     */
    handleMovement(elapsedMs: number): ObservablePoint;
    /**
     * Changes the defaultMode to chase or scatter, and turns the ghost around
     * if needed
     * @param {('chase'|'scatter')} newMode
     */
    changeMode(newMode: Mode): void;
    /**
     * Toggles a scared ghost between blue and white, then updates its spritsheet
     */
    toggleScaredColor(): void;
    /**
     * Sets the ghost's mode to SCARED, turns the ghost around,
     * and changes spritesheets accordingly
     */
    becomeScared(): void;
    /**
     * Returns the scared ghost to chase/scatter mode and sets its spritesheet
     */
    endScared(): void;
    /**
     * Speeds up the ghost (used for Blinky as Pacdots are eaten)
     */
    speedUp(): void;
    /**
     * Resets defaultSpeed to slow and updates the spritesheet
     */
    resetDefaultSpeed(): void;
    /**
     * Checks if the ghost contacts Pacman - starts the death sequence if so
     * @param {({x: number, y: number})} position - An x-y position on the 2D Maze Array
     * @param {MovableEntity} target - Pacman's
     */
    checkCollision(position: ObservablePoint, target: MovableEntity): void;
    /**
     * Determines the appropriate speed for the ghost
     * @param {({x: number, y: number})} position - An x-y position on the 2D Maze Array
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     * @returns {number}
     */
    determineVelocity(position: ObservablePoint, mode: Mode): any;
    onEaten(detail: any): void;
    /**
     * Updates the css position, hides if there is a stutter, and animates the spritesheet
     * @param {number} interp - The animation accuracy as a percentage
     */
    draw(interp: number): void;
    /**
     * Handles movement logic for the ghost
     * @param {number} elapsedMs - The amount of MS that have passed since the last update
     */
    update(elapsedMs: number): void;
}
export default Ghost;
//# sourceMappingURL=ghost.d.ts.map