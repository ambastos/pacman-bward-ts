"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_js_1 = require("./utils.js");
class CharacterUtil {
    directions;
    constructor() {
        this.directions = {
            up: "up",
            down: "down",
            left: "left",
            right: "right",
        };
    }
    /**
     * Check if a given character has moved more than five in-game tiles during a frame.
     * If so, we want to temporarily hide the object to avoid 'animation stutter'.
     * @param {({top: number, left: number})} position - Position during the current frame
     * @param {({top: number, left: number})} oldPosition - Position during the previous frame
     * @returns {('hidden'|'visible')} - The new 'visibility' css property value for the character.
     */
    checkForStutter(position, oldPosition) {
        let stutter = false;
        const threshold = 5;
        if (position && oldPosition) {
            if (Math.abs(position.y - oldPosition.y) > threshold
                || Math.abs(position.x - oldPosition.x) > threshold) {
                stutter = true;
            }
        }
        console.log("a");
        return stutter ? 'hidden' : 'visible';
    }
    /**
     * Check which CSS property needs to be changed given the character's current direction
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @returns {('top'|'left')}
     */
    getPropertyToChange(direction) {
        switch (direction) {
            case this.directions.up:
            case this.directions.down:
                return "y";
            default:
                return "x";
        }
    }
    /**
     * Calculate the velocity for the character's next frame.
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {number} velocityPerMs - The distance to travel in a single millisecond
     * @returns {number} - Moving down or right is positive, while up or left is negative.
     */
    getVelocity(direction, velocityPerMs) {
        switch (direction) {
            case this.directions.up:
            case this.directions.left:
                return velocityPerMs * -1;
            default:
                return velocityPerMs;
        }
    }
    /**
     * Determine the next value which will be used to draw the character's position on screen
     * @param {number} interp - The percentage of the desired timestamp between frames
     * @param {('top'|'left')} prop - The css property to be changed
     * @param {({top: number, left: number})} oldPosition - Position during the previous frame
     * @param {({top: number, left: number})} position - Position during the current frame
     * @returns {number} - New value for css positioning
     */
    calculateNewDrawValue(interp, prop, oldPosition, position) {
        return oldPosition[prop] + (position[prop] - oldPosition[prop]) * interp;
    }
    /**
     * Convert the character's css position to a row-column on the maze array
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {number} scaledTileSize - The dimensions of a single tile
     * @returns {({x: number, y: number})}
     */
    determineGridPosition(position, scaledTileSize) {
        return (0, utils_js_1.createObservablePoint)(this, (position.x / scaledTileSize) + 0.5, (position.y / scaledTileSize) + 0.5);
    }
    /**
     * Check to see if a character's disired direction results in turning around
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {('up'|'down'|'left'|'right')} desiredDirection - Character's desired orientation
     * @returns {boolean}
     */
    turningAround(direction, desiredDirection) {
        return desiredDirection === this.getOppositeDirection(direction);
    }
    /**
     * Calculate the opposite of a given direction
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @returns {('up'|'down'|'left'|'right')}
     */
    getOppositeDirection(direction) {
        switch (direction) {
            case this.directions.up:
                return this.directions.down;
            case this.directions.down:
                return this.directions.up;
            case this.directions.left:
                return this.directions.right;
            default:
                return this.directions.left;
        }
    }
    /**
     * Calculate the proper rounding function to assist with collision detection
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @returns {Function}
     */
    determineRoundingFunction(direction) {
        switch (direction) {
            case this.directions.up:
            case this.directions.left:
                return Math.floor;
            default:
                return Math.ceil;
        }
    }
    /**
     * Check to see if the character's next frame results in moving to a new tile on the maze array
     * @param {({x: number, y: number})} oldPosition - Position during the previous frame
     * @param {({x: number, y: number})} position - Position during the current frame
     * @returns {boolean}
     */
    changingGridPosition(oldPosition, position) {
        return (Math.floor(oldPosition.x) !== Math.floor(position.x)
            || Math.floor(oldPosition.y) !== Math.floor(position.y));
    }
    /**
     * Check to see if the character is attempting to run into a wall of the maze
     * @param {({x: number, y: number})} desiredNewGridPosition - Character's target tile
     * @param {Array} mazeArray - The 2D array representing the game's maze
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @returns {boolean}
     */
    checkForWallCollision(desiredNewGridPosition, mazeArray, direction) {
        const roundingFunction = this.determineRoundingFunction(direction);
        const desiredX = roundingFunction(desiredNewGridPosition.x);
        const desiredY = roundingFunction(desiredNewGridPosition.y);
        let newGridValue;
        if (Array.isArray(mazeArray[desiredY])) {
            newGridValue = mazeArray[desiredY][desiredX];
        }
        return (newGridValue === 'X');
    }
    /**
     * Returns an object containing the new position and grid position based upon a direction
     * @param {({top: number, left: number})} position - css position during the current frame
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {number} velocityPerMs - The distance to travel in a single millisecond
     * @param {number} elapsedMs - The amount of MS that have passed since the last update
     * @param {number} scaledTileSize - The dimensions of a single tile
     * @returns {object}
     */
    determineNewPositions(position, direction, velocityPerMs, elapsedMs, scaledTileSize) {
        const newPosition = (0, utils_js_1.createObservablePoint)(this, position.x, position.y);
        newPosition[this.getPropertyToChange(direction)]
            += this.getVelocity(direction, velocityPerMs) * elapsedMs;
        const newGridPosition = this.determineGridPosition(newPosition, scaledTileSize);
        return {
            newPosition,
            newGridPosition,
        };
    }
    /**
     * Calculates the css position when snapping the character to the x-y grid
     * @param {({x: number, y: number})} position - The character's position during the current frame
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {number} scaledTileSize - The dimensions of a single tile
     * @returns {({top: number, left: number})}
     */
    snapToGrid(position, direction, scaledTileSize) {
        const newPosition = (0, utils_js_1.copyPosition)(this, position);
        const roundingFunction = this.determineRoundingFunction(direction);
        switch (direction) {
            case this.directions.up:
            case this.directions.down:
                newPosition.y = roundingFunction(newPosition.y);
                break;
            default:
                newPosition.x = roundingFunction(newPosition.x);
                break;
        }
        return (0, utils_js_1.createObservablePoint)(this, (newPosition.x - 0.5) * scaledTileSize, (newPosition.y - 0.5) * scaledTileSize);
    }
    /**
     * Returns a modified position if the character needs to warp
     * @param {({top: number, left: number})} position - css position during the current frame
     * @param {({x: number, y: number})} gridPosition - x-y position during the current frame
     * @param {number} scaledTileSize - The dimensions of a single tile
     * @returns {({top: number, left: number})}
     */
    handleWarp(position, scaledTileSize, mazeArray) {
        const newPosition = (0, utils_js_1.createObservablePoint)(this, position.x, position.y);
        const gridPosition = this.determineGridPosition(position, scaledTileSize);
        if (gridPosition.x < -0.75) {
            newPosition.x = (scaledTileSize * (mazeArray[0].length - 0.75));
        }
        else if (gridPosition.x > (mazeArray[0].length - 0.25)) {
            newPosition.x = (scaledTileSize * -1.25);
        }
        return newPosition;
    }
    /**
     * Advances spritesheet by one frame if needed
     * @param {Object} character - The character which needs to be animated
     */
    advanceSpriteSheet(character) {
        const { msSinceLastSprite, frame, } = character;
        const updatedProperties = {
            msSinceLastSprite,
            frame,
        };
        const ready = (character.msSinceLastSprite > character.msBetweenSprites)
            && character.animate;
        if (ready) {
            updatedProperties.msSinceLastSprite = 0;
            if (character.frame < character.spriteFrames - 1) {
                updatedProperties.frame += 1;
            }
            else if (character.loopAnimation) {
                updatedProperties.frame = 0;
            }
        }
        return updatedProperties;
    }
}
// removeIf(production)
exports.default = CharacterUtil;
// endRemoveIf(production)