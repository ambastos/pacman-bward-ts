"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
class Entity {
    name;
    allowCollision = true;
    emitter;
    gameCoordinator;
    scaledTileSize;
    characterUtil;
    position;
    oldPosition;
    sprite;
    hitArea;
    msSinceLastSprite = 0;
    frame = 0;
    msBetweenSprites = 0;
    animate = false;
    measurement = 0;
    spriteFrames = 0;
    loopAnimation = false;
    mazeArray;
    moving;
    display;
    level;
    direction;
    constructor(gameCoordinator, name, characterUtil) {
        this.gameCoordinator = gameCoordinator;
        this.name = name;
        this.scaledTileSize = gameCoordinator.scaledTileSize;
        this.characterUtil = characterUtil;
        this.emitter = gameCoordinator.emitter;
    }
    getGridPosition() {
        return this.characterUtil?.determineGridPosition(this.position, this.scaledTileSize);
    }
    registerEventListeners() {
    }
    onReset() {
    }
    onDeath() {
    }
    reset() {
    }
    update(elapsedMs) {
        if (this.sprite) {
            const half = this.scaledTileSize * 0.5;
            const x = this.sprite.x + this.sprite.width * 0.5 - half;
            const y = this.sprite.y + this.sprite.height * 0.5 - half;
            this.sprite.hitArea =
                new pixi_js_1.Rectangle(x, y, this.scaledTileSize, this.scaledTileSize);
            this.hitArea = this.sprite.hitArea;
        }
    }
    draw(interp) {
    }
}
exports.default = Entity;