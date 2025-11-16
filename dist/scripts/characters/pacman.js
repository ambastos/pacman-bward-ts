import { Sprite } from "pixi.js";
import Entity from "./entity.js";
class Pacman extends Entity {
    velocityPerMs;
    pacmanArrow;
    spriteArrow;
    specialAnimation;
    desiredDirection;
    defaultPosition;
    death;
    constructor(gameCoordinator, characterUtil) {
        super(gameCoordinator, "pacman", characterUtil);
        this.scaledTileSize = gameCoordinator.scaledTileSize;
        this.mazeArray = gameCoordinator.mazeArray;
        this.characterUtil = characterUtil;
        this.animationTarget = document.getElementById('pacman');
        this.pacmanArrow = document.getElementById('pacman-arrow');
        this.sprite = null;
        this.spriteArrow = null;
        this.reset();
    }
    /**
     * Rests the character to its default state
     */
    reset() {
        this.setMovementStats(this.scaledTileSize);
        this.setSpriteAnimationStats();
        this.setStyleMeasurements(this.scaledTileSize, this.spriteFrames);
        this.setDefaultPosition(this.scaledTileSize);
        this.setSpriteSheet(this.direction);
        this.pacmanArrow.style.backgroundImage = 'url(app/style/graphics/'
            + `spriteSheets/characters/pacman/arrow_${this.direction}.svg)`;
    }
    registerEventListeners() {
        this.emitter.on("pacman-reset", this.onReset);
        this.emitter.on("pacman-death", this.onDeath);
    }
    /**
     * Sets various properties related to Pacman's movement
     * @param {number} scaledTileSize - The dimensions of a single tile
     */
    setMovementStats(scaledTileSize) {
        this.velocityPerMs = this.calculateVelocityPerMs(scaledTileSize);
        this.desiredDirection = this.characterUtil.directions.left;
        this.direction = this.characterUtil.directions.left;
        this.moving = false;
        this.allowCollision = true;
    }
    /**
     * Sets values pertaining to Pacman's spritesheet animation
     */
    setSpriteAnimationStats() {
        this.specialAnimation = false;
        this.display = true;
        this.animate = true;
        this.loopAnimation = true;
        this.msBetweenSprites = 50;
        this.msSinceLastSprite = 0;
        this.spriteFrames = 4;
        this.frame = 0;
        this.backgroundOffsetPixels = 0;
        this.animationTarget.style.backgroundPosition = '0px 0px';
    }
    /**
     * Sets css property values for Pacman and Pacman's Arrow
     * @param {number} scaledTileSize - The dimensions of a single tile
     * @param {number} spriteFrames - The number of frames in Pacman's spritesheet
     */
    setStyleMeasurements(scaledTileSize, spriteFrames) {
        this.measurement = scaledTileSize * 2;
        let frameX = scaledTileSize / spriteFrames;
        this.setSprite(this.direction, frameX);
        this.setArrowSprite(this.direction, frameX);
        this.animationTarget.style.height = `${this.measurement}px`;
        this.animationTarget.style.width = `${this.measurement}px`;
        this.animationTarget.style.backgroundSize = `${this.measurement * spriteFrames}px`;
        this.pacmanArrow.style.height = `${this.measurement * 2}px`;
        this.pacmanArrow.style.width = `${this.measurement * 2}px`;
        this.pacmanArrow.style.backgroundSize = `${this.measurement * 2}px`;
    }
    /**
     * Sets the default position and direction for Pacman at the game's start
     * @param {number} scaledTileSize - The dimensions of a single tile
     */
    setDefaultPosition(scaledTileSize) {
        this.defaultPosition = {
            top: scaledTileSize * 22.5,
            left: scaledTileSize * 13,
        };
        this.position = Object.assign({}, this.defaultPosition);
        this.oldPosition = Object.assign({}, this.position);
        this.animationTarget.style.top = `${this.position.top}px`;
        this.animationTarget.style.left = `${this.position.left}px`;
    }
    /**
     * Calculates how fast Pacman should move in a millisecond
     * @param {number} scaledTileSize - The dimensions of a single tile
     */
    calculateVelocityPerMs(scaledTileSize) {
        // In the original game, Pacman moved at 11 tiles per second.
        const velocityPerSecond = scaledTileSize * 11;
        return velocityPerSecond / 1000;
    }
    /**
     * Chooses a movement Spritesheet depending upon direction
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     */
    setSpriteSheet(direction) {
        this.death = false;
        this.setSprite(direction, 0);
        this.setArrowSprite(direction, 0);
        this.animationTarget.style.visibility = 'hidden';
        this.animationTarget.style.backgroundImage = 'url(app/style/graphics/'
            + `spriteSheets/characters/pacman/pacman_${direction}.svg)`;
    }
    getArrowTexture(direction, death) {
        let w = this.gameCoordinator.scaledTileSize * this.gameCoordinator.scale * 2;
        let frameX;
        switch (direction) {
            case 'left':
                frameX = 0;
                break;
            case 'right':
                frameX = 1;
                break;
            case 'up':
                frameX = 2;
                break;
            case 'down':
                frameX = 3;
                break;
        }
        if (death)
            return null;
        return this.gameCoordinator.am.getTexture("pacman", frameX, 0, w, w);
    }
    getTexture(direction, frameX, death) {
        let w = this.gameCoordinator.scaledTileSize * this.gameCoordinator.scale;
        let frameY;
        switch (direction) {
            case 'left':
                frameY = 2;
                break;
            case 'right':
                frameY = 3;
                break;
            case 'up':
                frameY = 4;
                break;
            case 'down':
                frameY = 5;
                break;
        }
        if (death)
            frameY = 6;
        return this.gameCoordinator.am.getTexture("pacman", frameX, frameY, w, w);
    }
    setSprite(direction, frameX, death) {
        const texture = this.getTexture(direction, frameX, death);
        if (!this.sprite)
            this.sprite = new Sprite(texture);
        else
            this.sprite.texture = texture;
    }
    setArrowSprite(direction, frameX, death) {
        const textureArrow = this.getArrowTexture(direction, death);
        if (!this.spriteArrow)
            this.spriteArrow = new Sprite(textureArrow);
        else
            this.spriteArrow.texture = textureArrow;
    }
    prepDeathAnimation() {
        this.loopAnimation = false;
        this.msBetweenSprites = 125;
        this.spriteFrames = 12;
        this.specialAnimation = true;
        this.frame = 0;
        this.death = true;
        this.setSprite(this.direction, this.frame, this.death);
        this.spriteArrow.visible = false;
        //this.setArrowSprite(this.direction, this.frame,  this.death)
        this.backgroundOffsetPixels = 0;
        const bgSize = this.measurement * this.spriteFrames;
        this.animationTarget.style.backgroundSize = `${bgSize}px`;
        this.animationTarget.style.backgroundImage = 'url(app/style/'
            + 'graphics/spriteSheets/characters/pacman/pacman_death.svg)';
        this.animationTarget.style.backgroundPosition = '0px 0px';
        this.pacmanArrow.style.backgroundImage = '';
    }
    /**
     * Changes Pacman's desiredDirection, updates the PacmanArrow sprite, and sets moving to true
     * @param {Event} e - The keydown event to evaluate
     * @param {Boolean} startMoving - If true, Pacman will move upon key press
     */
    changeDirection(newDirection, startMoving) {
        this.desiredDirection = newDirection;
        this.setArrowSprite(this.desiredDirection, 0);
        this.pacmanArrow.style.backgroundImage = 'url(app/style/graphics/'
            + `spriteSheets/characters/pacman/arrow_${this.desiredDirection}.svg)`;
        if (startMoving) {
            this.moving = true;
        }
    }
    /**
     * Updates the position of the leading arrow in front of Pacman
     * @param {({top: number, left: number})} position - Pacman's position during the current frame
     * @param {number} scaledTileSize - The dimensions of a single tile
     */
    updatePacmanArrowPosition(position, scaledTileSize) {
        this.pacmanArrow.style.top = `${position.top - scaledTileSize}px`;
        this.pacmanArrow.style.left = `${position.left - scaledTileSize}px`;
    }
    /**
     * Handle Pacman's movement when he is snapped to the x-y grid of the Maze Array
     * @param {number} elapsedMs - The amount of MS that have passed since the last update
     * @returns {({ top: number, left: number})}
     */
    handleSnappedMovement(elapsedMs) {
        const desired = this.characterUtil.determineNewPositions(this.position, this.desiredDirection, this.velocityPerMs, elapsedMs, this.scaledTileSize);
        const alternate = this.characterUtil.determineNewPositions(this.position, this.direction, this.velocityPerMs, elapsedMs, this.scaledTileSize);
        if (this.characterUtil.checkForWallCollision(desired.newGridPosition, this.mazeArray, this.desiredDirection)) {
            if (this.characterUtil.checkForWallCollision(alternate.newGridPosition, this.mazeArray, this.direction)) {
                this.moving = false;
                return this.position;
            }
            return alternate.newPosition;
        }
        this.direction = this.desiredDirection;
        this.setSpriteSheet(this.direction);
        return desired.newPosition;
    }
    /**
     * Handle Pacman's movement when he is inbetween tiles on the x-y grid of the Maze Array
     * @param {({x: number, y: number})} gridPosition - x-y position during the current frame
     * @param {number} elapsedMs - The amount of MS that have passed since the last update
     * @returns {({ top: number, left: number})}
     */
    handleUnsnappedMovement(gridPosition, elapsedMs) {
        const desired = this.characterUtil.determineNewPositions(this.position, this.desiredDirection, this.velocityPerMs, elapsedMs, this.scaledTileSize);
        const alternate = this.characterUtil.determineNewPositions(this.position, this.direction, this.velocityPerMs, elapsedMs, this.scaledTileSize);
        if (this.characterUtil.turningAround(this.direction, this.desiredDirection)) {
            this.direction = this.desiredDirection;
            this.setSpriteSheet(this.direction);
            return desired.newPosition;
        }
        if (this.characterUtil.changingGridPosition(gridPosition, alternate.newGridPosition)) {
            return this.characterUtil.snapToGrid(gridPosition, this.direction, this.scaledTileSize);
        }
        return alternate.newPosition;
    }
    /**
     */
    onDeath() {
        window.dispatchEvent(new Event('deathSequence'));
    }
    /**
     * Updates the css position, hides if there is a stutter, and animates the spritesheet
     * @param {number} interp - The animation accuracy as a percentage
     */
    draw(interp) {
        const newTop = this.characterUtil.calculateNewDrawValue(interp, 'top', this.oldPosition, this.position);
        const newLeft = this.characterUtil.calculateNewDrawValue(interp, 'left', this.oldPosition, this.position);
        this.animationTarget.style.top = `${newTop}px`;
        this.animationTarget.style.left = `${newLeft}px`;
        this.sprite.position.set(newLeft, newTop);
        const arrowLeft = newLeft - this.gameCoordinator.tileSize;
        const arrowTop = newTop - this.gameCoordinator.tileSize;
        this.spriteArrow.position.set(arrowLeft, arrowTop);
        this.animationTarget.style.visibility = this.display
            ? this.characterUtil.checkForStutter(this.position, this.oldPosition)
            : 'hidden';
        this.pacmanArrow.style.visibility = this.animationTarget.style.visibility;
        this.updatePacmanArrowPosition(this.position, this.scaledTileSize);
        const updatedProperties = this.characterUtil.advanceSpriteSheet(this);
        this.msSinceLastSprite = updatedProperties.msSinceLastSprite;
        this.animationTarget = updatedProperties.animationTarget;
        this.frame = updatedProperties.frame;
        this.setSprite(this.direction, updatedProperties.frame, this.death);
        this.sprite.visible = this.display;
        this.spriteArrow.visible = this.display;
        this.backgroundOffsetPixels = updatedProperties.backgroundOffsetPixels;
    }
    /**
     * Handles movement logic for Pacman
     * @param {number} elapsedMs - The amount of MS that have passed since the last update
     */
    update(elapsedMs) {
        super.update(elapsedMs);
        this.oldPosition = Object.assign({}, this.position);
        if (this.moving) {
            const gridPosition = this.characterUtil.determineGridPosition(this.position, this.scaledTileSize);
            if (JSON.stringify(this.position) === JSON.stringify(this.characterUtil.snapToGrid(gridPosition, this.direction, this.scaledTileSize))) {
                this.position = this.handleSnappedMovement(elapsedMs);
            }
            else {
                this.position = this.handleUnsnappedMovement(gridPosition, elapsedMs);
            }
            this.position = this.characterUtil.handleWarp(this.position, this.scaledTileSize, this.mazeArray);
        }
        if (this.moving || this.specialAnimation) {
            this.msSinceLastSprite += elapsedMs;
        }
    }
}
//Just to avoid problems with NYC coverage test
// if (!process.env.NYC_PROCESS_ID) 
//   global.window.Pacman = Pacman
// removeIf(production)
//module.exports = Pacman;
export default Pacman;
// endRemoveIf(production)
//# sourceMappingURL=pacman.js.map