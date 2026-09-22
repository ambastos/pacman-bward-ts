import { ObservablePoint, Sprite, Texture } from "pixi.js";
import GameCoordinator from "../core/gameCoordinator.ts";
import CharacterUtil from "../utilities/characterUtil.ts";
import MovableEntity from "./movableEntity.ts";
declare class Pacman extends MovableEntity {
    velocityPerMs: number;
    pacmanArrow: any;
    spriteArrow: Sprite | undefined;
    specialAnimation: boolean;
    desiredDirection: string;
    death: boolean;
    constructor(gameCoordinator: GameCoordinator, characterUtil: CharacterUtil);
    /**
     * Rests the character to its default state
     */
    reset(): void;
    registerEventListeners(): void;
    /**
     * Sets various properties related to Pacman's movement
     * @param {number} scaledTileSize - The dimensions of a single tile
     */
    setMovementStats(scaledTileSize: number): void;
    /**
     * Sets values pertaining to Pacman's spritesheet animation
     */
    setSpriteAnimationStats(): void;
    /**
     * Sets css property values for Pacman and Pacman's Arrow
     * @param {number} scaledTileSize - The dimensions of a single tile
     * @param {number} spriteFrames - The number of frames in Pacman's spritesheet
     */
    setStyleMeasurements(scaledTileSize: number, spriteFrames: number): void;
    /**
     * Sets the default position and direction for Pacman at the game's start
     * @param {number} scaledTileSize - The dimensions of a single tile
     */
    setDefaultPosition(scaledTileSize: number): void;
    /**
     * Calculates how fast Pacman should move in a millisecond
     * @param {number} scaledTileSize - The dimensions of a single tile
     */
    calculateVelocityPerMs(scaledTileSize: number): number;
    /**
     * Chooses a movement Spritesheet depending upon direction
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     */
    setSpriteSheet(direction: string): void;
    getArrowTexture(direction: any, death: any): Texture<import("pixi.js").Resource> | null | undefined;
    getTexture(direction: any, frameX: number | undefined, death: any): Texture<import("pixi.js").Resource> | undefined;
    setTexture(direction: string, frameX: number, death?: boolean): void;
    setArrowSprite(direction: string, frameX: number, death?: boolean): void;
    prepDeathAnimation(): void;
    /**
     * Changes Pacman's desiredDirection, updates the PacmanArrow sprite, and sets moving to true
     * @param {Event} e - The keydown event to evaluate
     * @param {Boolean} startMoving - If true, Pacman will move upon key press
     */
    changeDirection(newDirection: string, startMoving: boolean): void;
    /**
     * Handle Pacman's movement when he is snapped to the x-y grid of the Maze Array
     * @param {number} elapsedMs - The amount of MS that have passed since the last update
     * @returns {({ top: number, left: number})}
     */
    handleSnappedMovement(elapsedMs: number): any;
    /**
     * Handle Pacman's movement when he is inbetween tiles on the x-y grid of the Maze Array
     * @param {({x: number, y: number})} gridPosition - x-y position during the current frame
     * @param {number} elapsedMs - The amount of MS that have passed since the last update
     * @returns {({ top: number, left: number})}
     */
    handleUnsnappedMovement(gridPosition: ObservablePoint, elapsedMs: number): ObservablePoint;
    /**
     */
    onDeath(detail?: CustomEvent): void;
    /**
     * Updates the css position, hides if there is a stutter, and animates the spritesheet
     * @param {number} interp - The animation accuracy as a percentage
     */
    draw(interp: number): void;
    /**
     * Handles movement logic for Pacman
     * @param {number} elapsedMs - The amount of MS that have passed since the last update
     */
    update(elapsedMs: number): void;
}
export default Pacman;
//# sourceMappingURL=pacman.d.ts.map