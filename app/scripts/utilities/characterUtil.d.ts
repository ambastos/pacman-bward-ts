import { ObservablePoint } from "pixi.js";
import MovableEntity from "../characters/movableEntity.ts";
declare class CharacterUtil {
    directions: {
        up: string;
        down: string;
        left: string;
        right: string;
    };
    constructor();
    /**
     * Check if a given character has moved more than five in-game tiles during a frame.
     * If so, we want to temporarily hide the object to avoid 'animation stutter'.
     * @param {({top: number, left: number})} position - Position during the current frame
     * @param {({top: number, left: number})} oldPosition - Position during the previous frame
     * @returns {('hidden'|'visible')} - The new 'visibility' css property value for the character.
     */
    checkForStutter(position?: ObservablePoint, oldPosition?: ObservablePoint): string;
    /**
     * Check which CSS property needs to be changed given the character's current direction
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @returns {('top'|'left')}
     */
    getPropertyToChange(direction?: string): "x" | "y";
    /**
     * Calculate the velocity for the character's next frame.
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {number} velocityPerMs - The distance to travel in a single millisecond
     * @returns {number} - Moving down or right is positive, while up or left is negative.
     */
    getVelocity(direction: string, velocityPerMs: number): number;
    /**
     * Determine the next value which will be used to draw the character's position on screen
     * @param {number} interp - The percentage of the desired timestamp between frames
     * @param {('top'|'left')} prop - The css property to be changed
     * @param {({top: number, left: number})} oldPosition - Position during the previous frame
     * @param {({top: number, left: number})} position - Position during the current frame
     * @returns {number} - New value for css positioning
     */
    calculateNewDrawValue(interp: number, prop: "x" | "y", oldPosition: ObservablePoint, position: ObservablePoint): number;
    /**
     * Convert the character's css position to a row-column on the maze array
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {number} scaledTileSize - The dimensions of a single tile
     * @returns {({x: number, y: number})}
     */
    determineGridPosition(position: ObservablePoint, scaledTileSize: number, anchor: ObservablePoint, scale: number): ObservablePoint;
    /**
     * Check to see if a character's disired direction results in turning around
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {('up'|'down'|'left'|'right')} desiredDirection - Character's desired orientation
     * @returns {boolean}
     */
    turningAround(direction: string, desiredDirection: string): boolean;
    /**
     * Calculate the opposite of a given direction
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @returns {('up'|'down'|'left'|'right')}
     */
    getOppositeDirection(direction: string): string;
    /**
     * Calculate the proper rounding function to assist with collision detection
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @returns {Function}
     */
    determineRoundingFunction(direction: string): Function;
    /**
     * Check to see if the character's next frame results in moving to a new tile on the maze array
     * @param {({x: number, y: number})} oldPosition - Position during the previous frame
     * @param {({x: number, y: number})} position - Position during the current frame
     * @returns {boolean}
     */
    changingGridPosition(oldPosition: ObservablePoint, position: ObservablePoint): boolean;
    /**
     * Check to see if the character is attempting to run into a wall of the maze
     * @param {({x: number, y: number})} desiredNewGridPosition - Character's target tile
     * @param {Array} mazeArray - The 2D array representing the game's maze
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @returns {boolean}
     */
    checkForWallCollision(desiredNewGridPosition: ObservablePoint, mazeArray: string[][], direction: string): boolean;
    /**
     * Returns an object containing the new position and grid position based upon a direction
     * @param {({top: number, left: number})} position - css position during the current frame
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {number} velocityPerMs - The distance to travel in a single millisecond
     * @param {number} elapsedMs - The amount of MS that have passed since the last update
     * @param {number} scaledTileSize - The dimensions of a single tile
     * @returns {object}
     */
    determineNewPositions(position: ObservablePoint, direction: string, velocityPerMs: number, elapsedMs: number, scaledTileSize: number, anchor: ObservablePoint, scale: number): any;
    /**
     * Calculates the css position when snapping the character to the x-y grid
     * @param {({x: number, y: number})} gridPosition - The character's grid position during the current frame
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {ObservablePoint x:number,y:number} anchor - The anchor of the sprite (center 0.5,0,5 or top-left 0,0)
     * @param {number} scaledTileSize - The dimensions of a single tile
     * @returns {({top: number, left: number})}
     */
    snapToGrid(gridPosition: ObservablePoint, direction: string, scaledTileSize: number, anchor: ObservablePoint, scale: number): ObservablePoint;
    /**
     * //TODO: includes anchor and scale to handleWarp
     * Returns a modified position if the character needs to warp
     * @param {({top: number, left: number})} position - css position during the current frame
     * @param {({x: number, y: number})} gridPosition - x-y position during the current frame
     * @param {number} scaledTileSize - The dimensions of a single tile
     * @returns {({top: number, left: number})}
     */
    handleWarp(direction: string, position: ObservablePoint, scaledTileSize: number, mazeArray: any, anchor: ObservablePoint, scale: number): ObservablePoint;
    /**
     * Advances spritesheet by one frame if needed
     * @param {Object} character - The character which needs to be animated
     */
    advanceSpriteSheet(character: MovableEntity): any;
}
export default CharacterUtil;
//# sourceMappingURL=characterUtil.d.ts.map