import {  ObservablePoint, Sprite, Texture } from "pixi.js";
import StaticEntity from "./staticEntity.ts";
import GameCoordinator from "../core/gameCoordinator.ts";
import CharacterUtil from "../utilities/characterUtil.ts";
import { copyPosition } from "../utilities/utils.ts";
import _ from 'lodash'
import MovableEntity from "./movableEntity.ts";

class Pacman extends MovableEntity{
  velocityPerMs!:number
  pacmanArrow:any
  spriteArrow!:Sprite | undefined
  specialAnimation!:boolean 
  desiredDirection!: string;  
  death!: boolean;
  constructor(gameCoordinator:GameCoordinator, characterUtil:CharacterUtil) {
    super(gameCoordinator, "pacman", characterUtil)
    this.scaledTileSize = gameCoordinator.scaledTileSize;  
    this.mazeArray = gameCoordinator.mazeArray;
    this.characterUtil = characterUtil;
    this.spriteArrow = undefined
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
    super.reset()
  }

  registerEventListeners() {
    this.emitter.on("pacman-reset", this.onReset)  
    this.emitter.on("pacman-death", this.onDeath)
  }
  /**
   * Sets various properties related to Pacman's movement
   * @param {number} scaledTileSize - The dimensions of a single tile
   */
  setMovementStats(scaledTileSize:number) {
    this.velocityPerMs = this.calculateVelocityPerMs(scaledTileSize);
    this.desiredDirection = this.characterUtil!.directions.left;
    this.direction = this.characterUtil!.directions.left;
    this.moving = false;
    this.allowCollision = true
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
    this.frame = 0
  }

  /**
   * Sets css property values for Pacman and Pacman's Arrow
   * @param {number} scaledTileSize - The dimensions of a single tile
   * @param {number} spriteFrames - The number of frames in Pacman's spritesheet
   */
  setStyleMeasurements(scaledTileSize: number, spriteFrames: number) {
    this.measurement = scaledTileSize * 2;

    let frameX = scaledTileSize / spriteFrames
    this.setTexture(this.direction, frameX)
    this.setArrowSprite(this.direction, frameX)
  }

  /**
   * Sets the default position and direction for Pacman at the game's start
   * @param {number} scaledTileSize - The dimensions of a single tile
   */
  setDefaultPosition(scaledTileSize: number) {
    this.defaultPosition.set(
      scaledTileSize * 13,
      scaledTileSize * 22.5   
    )
    this.position.set(this.defaultPosition.x, this.defaultPosition.y);
    this.oldPosition.set(this.position.x, this.position.y)
    //this.oldPosition = Object.assign({}, this.position);
    //this.sprite?.position.set(this.position.x, this.position.y)
  }

  /**
   * Calculates how fast Pacman should move in a millisecond
   * @param {number} scaledTileSize - The dimensions of a single tile
   */
  calculateVelocityPerMs(scaledTileSize: number) {
    // In the original game, Pacman moved at 11 tiles per second.
    const velocityPerSecond = scaledTileSize * 11;
    return velocityPerSecond / 1000;
  }

  /**
   * Chooses a movement Spritesheet depending upon direction
   * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
   */
  setSpriteSheet(direction: string) {    
    this.death = false
    this.setTexture(direction, 0)
    this.setArrowSprite(direction, 0)
  }

  getArrowTexture(direction: any, death: any) {
    let w = this.gameCoordinator.scaledTileSize * this.gameCoordinator.scale * 2   
    let frameX
    switch (direction) {
      case 'left':
        frameX = 0
        break    
      case 'right':
        frameX = 1
        break            
      case 'up':
        frameX = 2
        break                
      case 'down':
        frameX = 3
        break                      
      }
      if (death)
        return null
      return this.gameCoordinator.am.getTexture("pacman", 
        frameX, 0, w, w)
  }
  getTexture(direction: any, frameX: number | undefined, death: any) {
    let w = this.gameCoordinator.scaledTileSize * this.gameCoordinator.scale    
    let frameY
    switch (direction) {
      case 'left':
        frameY = 2
        break    
      case 'right':
        frameY = 3
        break            
      case 'up':
        frameY = 4
        break                
      case 'down':
        frameY = 5
        break                      
      }
      if (death)
        frameY = 6
      return this.gameCoordinator.am.getTexture("pacman", 
        frameX, frameY, w, w)
  }
  setTexture(direction: string, frameX: number, death?: boolean) {    
    const texture = this.getTexture(direction, frameX, death)        
    this.texture = texture as Texture
    this.tint = 0x00ff00
    this.zIndex = 1
  }
  setArrowSprite(direction: string, frameX: number, death?: boolean) {    
    const textureArrow = this.getArrowTexture(direction, death)
    if (!this.spriteArrow) 
      this.spriteArrow = new Sprite(textureArrow as Texture)
    else 
      this.spriteArrow.texture = textureArrow as Texture
    this.spriteArrow.zIndex = 1    
  }
  prepDeathAnimation() {
    this.loopAnimation = false;
    this.msBetweenSprites = 125;
    this.spriteFrames = 12;
    this.specialAnimation = true;

    this.frame = 0
    this.death = true
    this.setTexture(this.direction, this.frame,  this.death)
    this.spriteArrow!.visible = false
    this.setArrowSprite(this.direction, this.frame,  this.death)
  }

  /**
   * Changes Pacman's desiredDirection, updates the PacmanArrow sprite, and sets moving to true
   * @param {Event} e - The keydown event to evaluate
   * @param {Boolean} startMoving - If true, Pacman will move upon key press
   */
  changeDirection(newDirection: string, startMoving: boolean) {
    this.desiredDirection = newDirection;

    this.setArrowSprite(this.desiredDirection, 0)
    if (startMoving) {
      this.moving = true;
    }
  }
  /**
   * Handle Pacman's movement when he is snapped to the x-y grid of the Maze Array
   * @param {number} elapsedMs - The amount of MS that have passed since the last update
   * @returns {({ top: number, left: number})}
   */
  handleSnappedMovement(elapsedMs: number) {
    const desired = this.characterUtil!.determineNewPositions(
      this.position, this.desiredDirection, this.velocityPerMs,
      elapsedMs, this.scaledTileSize,
    );
    const alternate = this.characterUtil!.determineNewPositions(
      this.position, this.direction, this.velocityPerMs,
      elapsedMs, this.scaledTileSize,
    );

    if (this.characterUtil!.checkForWallCollision(
      desired.newGridPosition, this.mazeArray, this.desiredDirection,
    )) {
      if (this.characterUtil!.checkForWallCollision(
        alternate.newGridPosition, this.mazeArray, this.direction,
      )) {
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
  handleUnsnappedMovement(gridPosition: ObservablePoint, elapsedMs: number):ObservablePoint {
    const desired = this.characterUtil!.determineNewPositions(
      this.position, this.desiredDirection, this.velocityPerMs,
      elapsedMs, this.scaledTileSize,
    );
    const alternate = this.characterUtil!.determineNewPositions(
      this.position, this.direction, this.velocityPerMs,
      elapsedMs, this.scaledTileSize,
    );

    if (this.characterUtil!.turningAround(
      this.direction, this.desiredDirection,
    )) {
      this.direction = this.desiredDirection;
      this.setSpriteSheet(this.direction);
      return desired.newPosition;
    } if (this.characterUtil!.changingGridPosition(
      gridPosition, alternate.newGridPosition,
    )) {
      return this.characterUtil!.snapToGrid(
        gridPosition, this.direction, this.scaledTileSize,
      );
    }
    return alternate.newPosition;
  }
  /**
   */
  onDeath(detail?:CustomEvent) {    
    window.dispatchEvent(new CustomEvent('deathSequence', {detail}))
  }
  /**
   * Updates the css position, hides if there is a stutter, and animates the spritesheet
   * @param {number} interp - The animation accuracy as a percentage
   */
  draw(interp: number) {
    const newY = this.characterUtil!.calculateNewDrawValue(
      interp, 'y', this.oldPosition, this.position,
    );
    const newX = this.characterUtil!.calculateNewDrawValue(
      interp, 'x', this.oldPosition, this.position,
    );

    //this.sprite!.position.set(newX, newY)  
    //this.position.set(newX, newY)
    const arrowX = newX-this.gameCoordinator.tileSize
    const arrowY = newY-this.gameCoordinator.tileSize
    this.spriteArrow!.position.set(arrowX, arrowY)

    const updatedProperties = this.characterUtil!.advanceSpriteSheet(this);

    this.msSinceLastSprite = updatedProperties.msSinceLastSprite;
    this.frame = updatedProperties.frame
    this.setTexture(this.direction, updatedProperties.frame, this.death)
    this.visible = this.display
    this.spriteArrow!.visible = this.display
  }

  /**
   * Handles movement logic for Pacman
   * @param {number} elapsedMs - The amount of MS that have passed since the last update
   */
  update(elapsedMs: number) {
    super.update(elapsedMs)
    this.oldPosition.set(this.position.x, this.position.y)

    if (this.moving) {
      const gridPosition = this.characterUtil!.determineGridPosition(
        this.position, this.scaledTileSize,
      );
      // const posString = JSON.stringify(this.position.copyTo(new Point))
      const snapToGrid =this.characterUtil!.snapToGrid(
          gridPosition, this.direction, this.scaledTileSize,
        )
 
      if (this.position.equals(snapToGrid) 
      ) {
        this.position = this.handleSnappedMovement(elapsedMs);
      } else {
        this.position = this.handleUnsnappedMovement(gridPosition, elapsedMs);
      }
      // if (JSON.stringify(this.position, replacer ) === JSON.stringify(
      //   this.characterUtil!.snapToGrid(
      //     gridPosition, this.direction, this.scaledTileSize,
      //   ),replacer
      // )) {
      //   this.position = this.handleSnappedMovement(elapsedMs);
      // } else {
      //   this.position = this.handleUnsnappedMovement(gridPosition, elapsedMs);
      // }

      this.position = this.characterUtil!.handleWarp(
        this.position, this.scaledTileSize, this.mazeArray,
      );
    }

    if (this.moving || this.specialAnimation) {
      this.msSinceLastSprite += elapsedMs;
    }
  }
}
// removeIf(production)
export default Pacman
// endRemoveIf(production)
