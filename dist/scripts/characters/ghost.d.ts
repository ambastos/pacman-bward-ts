import Entity from "./entity.js";
import GameCoordinator from "../core/gameCoordinator.js";
import CharacterUtil from "../utilities/characterUtil.js";
import Pacman from "./pacman.js";
import { Coordinate, Position } from "./types.js";
declare class Ghost extends Entity {
    pacman: Pacman;
    level: number;
    blinky: Ghost | undefined;
    defaultSpeed: any;
    cruiseElroy: any;
    mode: string;
    defaultMode: string;
    idleMode: string | undefined;
    slowSpeed: number;
    mediumSpeed: number;
    fastSpeed: number;
    scaredSpeed: number;
    transitionSpeed: number;
    eyeSpeed: number;
    velocityPerMs: number;
    emotion: string;
    scaredColor: string;
    defaultPosition: Position;
    defaultDirection: string;
    paused: boolean;
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
    getTexture(name: string, direction: string, emotion: string, frameX: number): any;
    setSprite(name: string, direction: string, emotion: string, frameX: number): void;
    /**
     * Checks to see if the ghost is currently in the 'tunnels' on the outer edges of the maze
     * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
     * @returns {Boolean}
     */
    isInTunnel(gridPosition: Coordinate): boolean;
    /**
     * Checks to see if the ghost is currently in the 'Ghost House' in the center of the maze
     * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
     * @returns {Boolean}
     */
    isInGhostHouse(gridPosition: Coordinate | undefined): boolean;
    /**
     * Checks to see if the tile at the given coordinates of the Maze is an open position
     * @param {Array} mazeArray - 2D array representing the game board
     * @param {number} y - The target row
     * @param {number} x - The target column
     * @returns {(false | { x: number, y: number})} - x-y pair if the tile is free, false otherwise
     */
    getTile(mazeArray: [][], y: number, x: number): any;
    /**
     * Returns a list of all of the possible moves for the ghost to make on the next turn
     * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {Array} mazeArray - 2D array representing the game board
     * @returns {object}
     */
    determinePossibleMoves(gridPosition: Coordinate, direction: string, mazeArray: [][]): any;
    /**
     * Uses the Pythagorean Theorem to measure the distance between a given postion and Pacman
     * @param {({x: number, y: number})} position - An x-y position on the 2D Maze Array
     * @param {({x: number, y: number})} pacman - Pacman's current x-y position on the 2D Maze Array
     * @returns {number}
     */
    calculateDistance(position: Coordinate, pacman: Coordinate): number;
    /**
     * Gets a position a number of spaces in front of Pacman's direction
     * @param {({x: number, y: number})} pacmanGridPosition
     * @param {number} spaces
     */
    getPositionInFrontOfPacman(pacmanGridPosition: Coordinate, spaces: number): Coordinate;
    /**
     * Determines Pinky's target, which is four tiles in front of Pacman's direction
     * @param {({x: number, y: number})} pacmanGridPosition
     * @returns {({x: number, y: number})}
     */
    determinePinkyTarget(pacmanGridPosition: Coordinate): Coordinate;
    /**
     * Determines Inky's target, which is a mirror image of Blinky's position
     * reflected across a point two tiles in front of Pacman's direction.
     * Example @ app\style\graphics\spriteSheets\references\inky_target.png
     * @param {({x: number, y: number})} pacmanGridPosition
     * @returns {({x: number, y: number})}
     */
    determineInkyTarget(pacmanGridPosition: Coordinate): Coordinate;
    /**
     * Clyde targets Pacman when the two are far apart, but retreats to the
     * lower-left corner when the two are within eight tiles of each other
     * @param {({x: number, y: number})} gridPosition
     * @param {({x: number, y: number})} pacmanGridPosition
     * @returns {({x: number, y: number})}
     */
    determineClydeTarget(gridPosition: Coordinate, pacmanGridPosition: Coordinate): Coordinate;
    /**
     * Determines the appropriate target for the ghost's AI
     * @param {('inky'|'blinky'|'pinky'|'clyde')} name - The name of the current ghost
     * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
     * @param {({x: number, y: number})} pacmanGridPosition - x-y position on the 2D Maze Array
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     * @returns {({x: number, y: number})}
     */
    getTarget(name: string, gridPosition: Coordinate, pacmanGridPosition: Coordinate, mode: string): Coordinate;
    /**
     * Calls the appropriate function to determine the best move depending on the ghost's name
     * @param {('inky'|'blinky'|'pinky'|'clyde')} name - The name of the current ghost
     * @param {Object} possibleMoves - All of the moves the ghost could choose to make this turn
     * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
     * @param {({x: number, y: number})} pacmanGridPosition - x-y position on the 2D Maze Array
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     * @returns {('up'|'down'|'left'|'right')}
     */
    determineBestMove(name: string, possibleMoves: any, gridPosition: Coordinate, pacmanGridPosition: Coordinate, mode: string): any;
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
    determineDirection(name: string, gridPosition: Coordinate, pacmanGridPosition: Coordinate, direction: string, mazeArray: [][], mode: string): any;
    /**
     * Handles movement for idle Ghosts in the Ghost House
     * @param {*} elapsedMs
     * @param {*} position
     * @param {*} velocity
     * @returns {({ top: number, left: number})}
     */
    handleIdleMovement(elapsedMs: number, position: Coordinate, velocity: number): Position;
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
    handleSnappedMovement(elapsedMs: number, gridPosition: Coordinate, velocity: number, pacmanGridPosition: Coordinate): Position;
    /**
     * Determines if an eaten ghost is at the entrance of the Ghost House
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     * @param {({x: number, y: number})} position - x-y position during the current frame
     * @returns {Boolean}
     */
    enteringGhostHouse(mode: string, position: Coordinate): boolean;
    /**
     * Determines if an eaten ghost has reached the center of the Ghost House
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     * @param {({x: number, y: number})} position - x-y position during the current frame
     * @returns {Boolean}
     */
    enteredGhostHouse(mode: string, position: Coordinate): boolean;
    /**
     * Determines if a restored ghost is at the exit of the Ghost House
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     * @param {({x: number, y: number})} position - x-y position during the current frame
     * @returns {Boolean}
     */
    leavingGhostHouse(mode: string, position: Coordinate): boolean;
    /**
     * Handles entering and leaving the Ghost House after a ghost is eaten
     * @param {({x: number, y: number})} gridPosition - x-y position during the current frame
     * @returns {({x: number, y: number})}
     */
    handleGhostHouse(gridPosition: Coordinate): Coordinate;
    /**
     * Handle the ghost's movement when it is inbetween tiles on the x-y grid of the Maze Array
     * @param {number} elapsedMs - The amount of MS that have passed since the last update
     * @param {({x: number, y: number})} gridPosition - x-y position during the current frame
     * @param {number} velocity - The distance the character should travel in a single millisecond
     * @returns {({ top: number, left: number})}
     */
    handleUnsnappedMovement(elapsedMs: number, gridPosition: Coordinate, velocity: number): any;
    /**
     * Determines the new Ghost position
     * @param {number} elapsedMs
     * @returns {({ top: number, left: number})}
     */
    handleMovement(elapsedMs: number): Position;
    /**
     * Changes the defaultMode to chase or scatter, and turns the ghost around
     * if needed
     * @param {('chase'|'scatter')} newMode
     */
    changeMode(newMode: string): void;
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
     * Sets a flag to indicate when the ghost should pause its movement
     * @param {Boolean} newValue
     */
    pause(newValue: boolean): void;
    /**
     * Checks if the ghost contacts Pacman - starts the death sequence if so
     * @param {({x: number, y: number})} position - An x-y position on the 2D Maze Array
     * @param {({x: number, y: number})} pacman - Pacman's current x-y position on the 2D Maze Array
     */
    checkCollision(position: Coordinate, pacman: Coordinate): void;
    /**
     * Determines the appropriate speed for the ghost
     * @param {({x: number, y: number})} position - An x-y position on the 2D Maze Array
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     * @returns {number}
     */
    determineVelocity(position: Coordinate, mode: string): any;
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