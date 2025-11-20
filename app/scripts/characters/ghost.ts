import { Container, ObservablePoint, Rectangle, RenderTexture, Sprite, Texture } from "pixi.js";
import StaticEntity from "./staticEntity.ts";
import GameCoordinator from "../core/gameCoordinator.ts";
import CharacterUtil from "../utilities/characterUtil.ts";
import Pacman from "./pacman.ts";
import { copyPosition, createObservablePoint } from "../utilities/utils.ts";
import MovableEntity from "./movableEntity.ts";

class Ghost extends MovableEntity{
    pacman:Pacman
    blinky:Ghost | undefined;    
    defaultSpeed!:any    
    cruiseElroy!:any
    mode!:string 
    defaultMode!:string
    idleMode!:string | undefined
    slowSpeed!:number
    mediumSpeed!:number
    fastSpeed!:number
    scaredSpeed!:number
    transitionSpeed!:number
    eyeSpeed!:number 
    velocityPerMs!:number 
    emotion!:string
    scaredColor!:string
    defaultDirection!:string
    paused!:boolean

  constructor(gameCoordinator:GameCoordinator, name:string, 
    level:number, characterUtil:CharacterUtil, blinky?:Ghost
  ) {
    super(gameCoordinator, name, characterUtil)
    this.scaledTileSize = gameCoordinator.scaledTileSize;
    this.mazeArray = gameCoordinator.mazeArray;
    this.pacman = gameCoordinator.pacman;
    this.name = name;
    this.level = level;
    this.characterUtil = characterUtil;
    this.blinky = blinky;

    this.reset();    
    
  }

  /**
   * Rests the character to its default state
   * @param {Boolean} fullGameReset
   */
  reset(fullGameReset?:boolean) {
    if (fullGameReset) {
      delete this.defaultSpeed;
      delete this.cruiseElroy;
    }

    this.setDefaultMode();
    this.setMovementStats(this.pacman, this.name!, this.level);
    this.setSpriteAnimationStats();
    this.setStyleMeasurements(this.scaledTileSize, this.spriteFrames);
    this.setDefaultPosition(this.scaledTileSize, this.name!);
    this.setSpriteSheet(this.name!, this.direction, this.mode);
  }

  registerEventListeners() {
    this.emitter.on("ghost-eaten-"+this.name, this.onEaten)
  }
  /**
   * Sets the default mode and idleMode behavior
   */
  setDefaultMode() {
    this.allowCollision = true;
    this.defaultMode = 'scatter';
    this.mode = 'scatter';
    if (this.name !== 'blinky') {
      this.idleMode = 'idle';
    }
  }

  /**
   * Sets various properties related to the ghost's movement
   * @param {Object} pacman - Pacman's speed is used as the base for the ghosts' speeds
   * @param {('inky'|'blinky'|'pinky'|'clyde')} name - The name of the current ghost
   */
  setMovementStats(pacman:Pacman, name:string, level:number) {
    const pacmanSpeed = pacman.velocityPerMs;
    const levelAdjustment = level / 100;

    this.slowSpeed = pacmanSpeed * (0.75 + levelAdjustment);
    this.mediumSpeed = pacmanSpeed * (0.875 + levelAdjustment);
    this.fastSpeed = pacmanSpeed * (1 + levelAdjustment);

    if (!this.defaultSpeed) {
      this.defaultSpeed = this.slowSpeed;
    }

    this.scaredSpeed = pacmanSpeed * 0.5;
    this.transitionSpeed = pacmanSpeed * 0.4;
    this.eyeSpeed = pacmanSpeed * 2;

    this.velocityPerMs = this.defaultSpeed;
    this.moving = false;

    switch (name) {
      case 'blinky':
        this.defaultDirection = this.characterUtil!.directions.left;
        break;
      case 'pinky':
        this.defaultDirection = this.characterUtil!.directions.down;
        break;
      case 'inky':
        this.defaultDirection = this.characterUtil!.directions.up;
        break;
      case 'clyde':
        this.defaultDirection = this.characterUtil!.directions.up;
        break;
      default:
        this.defaultDirection = this.characterUtil!.directions.left;
        break;
    }
    this.direction = this.defaultDirection;
  }

  /**
   * Sets values pertaining to the ghost's spritesheet animation
   */
  setSpriteAnimationStats() {
    this.display = true;
    this.loopAnimation = true;
    this.animate = true;
    this.msBetweenSprites = 250;
    this.msSinceLastSprite = 0;

    this.frame = 0
    this.spriteFrames = 2;
  }

  /**
   * Sets css property values for the ghost
   * @param {number} scaledTileSize - The dimensions of a single tile
   * @param {number} spriteFrames - The number of frames in the ghost's spritesheet
   */
  setStyleMeasurements(scaledTileSize:number, spriteFrames:number) {
    // The ghosts are the size of 2x2 game tiles.
    this.measurement = scaledTileSize * 2;
  }

  /**
   * Sets the default position and direction for the ghosts at the game's start
   * @param {number} scaledTileSize - The dimensions of a single tile
   * @param {('inky'|'blinky'|'pinky'|'clyde')} name - The name of the current ghost
   */
  setDefaultPosition(scaledTileSize:number, name:string) {
    
    switch (name) {
      case 'blinky':
        this.defaultPosition = createObservablePoint(this,
          scaledTileSize * 13,
          scaledTileSize * 10.5,
        );
        break;
      case 'pinky':
        this.defaultPosition = createObservablePoint(this,
          scaledTileSize * 13,
          scaledTileSize * 13.5,
        );
        break;
      case 'inky':
        this.defaultPosition = createObservablePoint(this,
          scaledTileSize * 11,
          scaledTileSize * 13.5,
        );
        break;
      case 'clyde':
        this.defaultPosition = createObservablePoint(this,
          scaledTileSize * 15,
          scaledTileSize * 13.5,
        );
        break;
      default:
        this.defaultPosition = createObservablePoint(this,
          0,
          0,
        );
        break;
    }
    this.position =  createObservablePoint(this,this.defaultPosition.x, this.defaultPosition.y)
    this.oldPosition = createObservablePoint(this,this.position.x, this.position.y)
    //this.sprite?.position.set(this.position.x, this.position.y)
  }

  /**
   * Chooses a movement Spritesheet depending upon direction
   * @param {('inky'|'blinky'|'pinky'|'clyde')} name - The name of the current ghost
   * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
   * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
   */
  setSpriteSheet(name:string, direction:string, mode:string) {
    this.emotion = '';
    if (this.defaultSpeed !== this.slowSpeed) {
      this.emotion = (this.defaultSpeed === this.mediumSpeed)
        ? '_annoyed' : '_angry';
    }

    if (mode === 'scared') {
      this.frame = 0
      let scared = this.scaredColor == "blue" ? "scared" : "scaredWhite"
      this.setTexture(this.name!, this.direction,this.frame,scared)
    } else if (mode === 'eyes') {
      this.frame = 0
      this.setTexture(this.name!, this.direction,this.frame,"eyes")
    } else {
      this.setTexture(this.name!, this.direction,this.frame,this.emotion)
    }
  }
  getTexture(name:string, direction:string, frameX:number, emotion:string) {
    let frameY:number=0, fx = frameX ? frameX : 0
    switch (name) {
      case "blinky":
        frameY = 0
        break;
      case "pinky":
        frameY = 12
        break;
      case "inky":
        frameY = 16
        break;
      case "clyde":
        frameY = 20
        break;            
    }

    switch (emotion) {
      case "_angry":
        frameY += 4   
        break;
      case "_angry":
        frameY += 8   
        break;
      case "eyes":
        frameY = 24 
        break 
      case "scared":
        frameY = 28
        break;
      case "scaredWhite":
        frameY = 29
        break;        
    }
    if (emotion != "scared" && emotion != "scaredWhite") {
      switch (direction) {
        case "left":
          frameY+=0
          break;
        case "right":
          frameY+=1
          break;
        case "up":
          frameY+=2
          break;
        case "down":
          frameY+=3
          break;
      }
    }
    let w = this.gameCoordinator.scaledTileSize * this.gameCoordinator.scale    
    return this.gameCoordinator.am.getTexture("ghosts", frameX, frameY, w, w)
  }
  setTexture(name:string, direction:string,frameX:number, 
    emotion:string | null, frameY?:number, width?:number, height?:number):void {
      this.texture = this.getTexture(name, direction,frameX, emotion!) as Texture
      this.zIndex = 1
  }
  /**
   * Checks to see if the ghost is currently in the 'tunnels' on the outer edges of the maze
   * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
   * @returns {Boolean}
   */
  isInTunnel(gridPosition:ObservablePoint):boolean {
    return (
      gridPosition.y === 14
      && (gridPosition.x < 6 || gridPosition.x > 21)
    );
  }

  /**
   * Checks to see if the ghost is currently in the 'Ghost House' in the center of the maze
   * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
   * @returns {Boolean}
   */
  isInGhostHouse(gridPosition:ObservablePoint | undefined):boolean {
    return (
      (gridPosition!.x > 9 && gridPosition!.x < 18)
      && (gridPosition!.y > 11 && gridPosition!.y < 17)
    );
  }

  /**
   * Checks to see if the tile at the given coordinates of the Maze is an open position
   * @param {Array} mazeArray - 2D array representing the game board
   * @param {number} y - The target row
   * @param {number} x - The target column
   * @returns {(false | { x: number, y: number})} - x-y pair if the tile is free, false otherwise
   */
  getTile(mazeArray:[][], y:number, x:number):{x:number,y:number}{
    let tile = undefined;

    if (mazeArray[y] && mazeArray[y][x] && mazeArray[y][x] !== 'X') {
      tile = {
        x,
        y,
      };
    }

    return tile!;
  }

  /**
   * Returns a list of all of the possible moves for the ghost to make on the next turn
   * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
   * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
   * @param {Array} mazeArray - 2D array representing the game board
   * @returns {object}
   */
  determinePossibleMoves(gridPosition:ObservablePoint, direction:string, mazeArray:[][]):any {
    const { x, y } = gridPosition;

    const possibleMoves:any = {
      up: this.getTile(mazeArray, y - 1, x),
      down: this.getTile(mazeArray, y + 1, x),
      left: this.getTile(mazeArray, y, x - 1),
      right: this.getTile(mazeArray, y, x + 1),
    };
    
    // Ghosts are not allowed to turn around at crossroads
    possibleMoves[this.characterUtil!.getOppositeDirection(direction)] = undefined;

    Object.keys(possibleMoves).forEach((tile) => {
      if (possibleMoves[tile] === undefined) {
        delete possibleMoves[tile];
      }
    });

    return possibleMoves;
  }

  /**
   * Uses the Pythagorean Theorem to measure the distance between a given postion and Pacman
   * @param {({x: number, y: number})} position - An x-y position on the 2D Maze Array
   * @param {({x: number, y: number})} pacman - Pacman's current x-y position on the 2D Maze Array
   * @returns {number}
   */
  calculateDistance(position:ObservablePoint, pacman:ObservablePoint):number {
    return Math.sqrt(
      ((position.x - pacman.x) ** 2) + ((position.y - pacman.y) ** 2),
    );
  }

  /**
   * Gets a position a number of spaces in front of Pacman's direction
   * @param {({x: number, y: number})} pacmanGridPosition
   * @param {number} spaces
   */
  getPositionInFrontOfPacman(pacmanGridPosition:ObservablePoint, spaces:number):ObservablePoint {
    const target = copyPosition(this,pacmanGridPosition);
    const pacDirection = this.pacman.direction;
    const propToChange = (pacDirection === 'up' || pacDirection === 'down')
      ? 'y' : 'x';
    const tileOffset = (pacDirection === 'up' || pacDirection === 'left')
      ? (spaces * -1) : spaces;
    target[propToChange] += tileOffset;

    return target;
  }

  /**
   * Determines Pinky's target, which is four tiles in front of Pacman's direction
   * @param {({x: number, y: number})} pacmanGridPosition
   * @returns {({x: number, y: number})}
   */
  determinePinkyTarget(pacmanGridPosition:ObservablePoint):ObservablePoint {
    return this.getPositionInFrontOfPacman(
      pacmanGridPosition, 4,
    );
  }

  /**
   * Determines Inky's target, which is a mirror image of Blinky's position
   * reflected across a point two tiles in front of Pacman's direction.
   * Example @ app\style\graphics\spriteSheets\references\inky_target.png
   * @param {({x: number, y: number})} pacmanGridPosition
   * @returns {({x: number, y: number})}
   */
  determineInkyTarget(pacmanGridPosition:ObservablePoint):ObservablePoint {
    const blinkyGridPosition = this.characterUtil!.determineGridPosition(
      this.blinky!.position, this.scaledTileSize,
    );
    const pivotPoint = this.getPositionInFrontOfPacman(
      pacmanGridPosition, 2,
    );
    return createObservablePoint(
      this,
      pivotPoint.x + (pivotPoint.x - blinkyGridPosition.x),
      pivotPoint.y + (pivotPoint.y - blinkyGridPosition.y)
    )
  }

  /**
   * Clyde targets Pacman when the two are far apart, but retreats to the
   * lower-left corner when the two are within eight tiles of each other
   * @param {({x: number, y: number})} gridPosition
   * @param {({x: number, y: number})} pacmanGridPosition
   * @returns {({x: number, y: number})}
   */
  determineClydeTarget(gridPosition:ObservablePoint, pacmanGridPosition:ObservablePoint):ObservablePoint {
    const distance = this.calculateDistance(gridPosition, pacmanGridPosition);
    return (distance > 8) ? pacmanGridPosition : { x: 0, y: 30 } as ObservablePoint;
  }

  /**
   * Determines the appropriate target for the ghost's AI
   * @param {('inky'|'blinky'|'pinky'|'clyde')} name - The name of the current ghost
   * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
   * @param {({x: number, y: number})} pacmanGridPosition - x-y position on the 2D Maze Array
   * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
   * @returns {({x: number, y: number})}
   */
  getTarget(name:string, gridPosition:ObservablePoint, pacmanGridPosition:ObservablePoint, mode:string):ObservablePoint {
    // Ghosts return to the ghost-house after eaten
    if (mode === 'eyes') {
      return createObservablePoint(this,13.5,10)
    }

    // Ghosts run from Pacman if scared
    if (mode === 'scared') {
      return pacmanGridPosition;
    }

    // Ghosts seek out corners in Scatter mode
    if (mode === 'scatter') {
      switch (name) {
        case 'blinky':
          // Blinky will chase Pacman, even in Scatter mode, if he's in Cruise Elroy form
          //{ x: 27, y: 0 }
          return (this.cruiseElroy ? pacmanGridPosition : createObservablePoint(this,27,0));
        case 'pinky':
          return  createObservablePoint(this,0,0);
        case 'inky':
          return  createObservablePoint(this,27,30);
        case 'clyde':
          return  createObservablePoint(this,0,30);
        default:
          return  createObservablePoint(this,0,0);
      }
    }

    switch (name) {
      // Blinky goes after Pacman's position
      case 'blinky':
        return pacmanGridPosition;
      case 'pinky':
        return this.determinePinkyTarget(pacmanGridPosition);
      case 'inky':
        return this.determineInkyTarget(pacmanGridPosition);
      case 'clyde':
        return this.determineClydeTarget(gridPosition, pacmanGridPosition);
      default:
        // TODO: Other ghosts
        return pacmanGridPosition;
    }
  }

  /**
   * Calls the appropriate function to determine the best move depending on the ghost's name
   * @param {('inky'|'blinky'|'pinky'|'clyde')} name - The name of the current ghost
   * @param {Object} possibleMoves - All of the moves the ghost could choose to make this turn
   * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
   * @param {({x: number, y: number})} pacmanGridPosition - x-y position on the 2D Maze Array
   * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
   * @returns {('up'|'down'|'left'|'right')}
   */
  determineBestMove(
    name:string, possibleMoves:any, gridPosition:ObservablePoint, pacmanGridPosition:ObservablePoint, mode:string,
  ):any {
    let bestDistance = (mode === 'scared') ? 0 : Infinity;
    let bestMove;
    const target = this.getTarget(name, gridPosition, pacmanGridPosition, mode);

    Object.keys(possibleMoves).forEach((move) => {
      const distance = this.calculateDistance(
        possibleMoves[move], target,
      );
      const betterMove = (mode === 'scared')
        ? (distance > bestDistance)
        : (distance < bestDistance);

      if (betterMove) {
        bestDistance = distance;
        bestMove = move;
      }
    });

    return bestMove;
  }

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
  determineDirection(
    name:string, gridPosition:ObservablePoint, pacmanGridPosition:ObservablePoint, 
      direction:string, mazeArray:[][], mode:string,
  ) {
    let newDirection:any = direction;
    const possibleMoves = this.determinePossibleMoves(
      gridPosition, direction, mazeArray,
    );

    if (Object.keys(possibleMoves).length === 1) {
      [newDirection] = Object.keys(possibleMoves);
    } else if (Object.keys(possibleMoves).length > 1) {
      newDirection = this.determineBestMove(
        name, possibleMoves, gridPosition, pacmanGridPosition, mode,
      );
    }

    return newDirection;
  }

  /**
   * Handles movement for idle Ghosts in the Ghost House
   * @param {*} elapsedMs
   * @param {*} position
   * @param {*} velocity
   * @returns {({ top: number, left: number})}
   */
  handleIdleMovement(elapsedMs:number, position:ObservablePoint, velocity:number):ObservablePoint {
    const newPosition = copyPosition(this, this.position);
        
    if (position.y <= 13.5) {
      this.direction = this.characterUtil!.directions.down;
    } else if (position.y >= 14.5) {
      this.direction = this.characterUtil!.directions.up;
    }

    if (this.idleMode === 'leaving') {
      if (position.x === 13.5 && (position.y > 10.8 && position.y < 11)) {
        this.idleMode = undefined;
        newPosition.y = this.scaledTileSize * 10.5;
        this.direction = this.characterUtil!.directions.left;
        window.dispatchEvent(new Event('releaseGhost'));
      } else if (position.x > 13.4 && position.x < 13.6) {
        newPosition.x = this.scaledTileSize * 13;
        this.direction = this.characterUtil!.directions.up;
      } else if (position.y > 13.9 && position.y < 14.1) {
        newPosition.y = this.scaledTileSize * 13.5;
        this.direction = (position.x < 13.5)
          ? this.characterUtil!.directions.right
          : this.characterUtil!.directions.left;
      }
    }

    newPosition[this.characterUtil!.getPropertyToChange(this.direction)]
      += this.characterUtil!.getVelocity(this.direction, velocity) * elapsedMs;

    return newPosition;
  }

  /**
   * Sets idleMode to 'leaving', allowing the ghost to leave the Ghost House
   */
  endIdleMode() {
    this.idleMode = 'leaving';
  }

  /**
   * Handle the ghost's movement when it is snapped to the x-y grid of the Maze Array
   * @param {number} elapsedMs - The amount of MS that have passed since the last update
   * @param {({x: number, y: number})} gridPosition - x-y position during the current frame
   * @param {number} velocity - The distance the character should travel in a single millisecond
   * @param {({x: number, y: number})} pacmanGridPosition - x-y position on the 2D Maze Array
   * @returns {({ top: number, left: number})}
   */
  handleSnappedMovement(elapsedMs:number, gridPosition:ObservablePoint, 
      velocity:number, pacmanGridPosition:ObservablePoint):ObservablePoint {
    const newPosition = copyPosition(this,this.position)

    this.direction = this.determineDirection(
      this.name!, gridPosition, pacmanGridPosition, this.direction,
      this.mazeArray, this.mode,
    );
    newPosition[this.characterUtil!.getPropertyToChange(this.direction)]
      += this.characterUtil!.getVelocity(this.direction, velocity) * elapsedMs;

    return newPosition;
  }

  /**
   * Determines if an eaten ghost is at the entrance of the Ghost House
   * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
   * @param {({x: number, y: number})} position - x-y position during the current frame
   * @returns {Boolean}
   */
  enteringGhostHouse(mode:string, position:ObservablePoint):boolean {
    return (
      mode === 'eyes'
      && position.y === 11
      && (position.x > 13.4 && position.x < 13.6)
    );
  }

  /**
   * Determines if an eaten ghost has reached the center of the Ghost House
   * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
   * @param {({x: number, y: number})} position - x-y position during the current frame
   * @returns {Boolean}
   */
  enteredGhostHouse(mode:string, position:ObservablePoint):boolean {
    return (
      mode === 'eyes'
      && position.x === 13.5
      && (position.y > 13.8 && position.y < 14.2)
    );
  }

  /**
   * Determines if a restored ghost is at the exit of the Ghost House
   * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
   * @param {({x: number, y: number})} position - x-y position during the current frame
   * @returns {Boolean}
   */
  leavingGhostHouse(mode:string, position:ObservablePoint):boolean {
    return (
      mode !== 'eyes'
      && position.x === 13.5
      && (position.y > 10.8 && position.y < 11)
    );
  }

  /**
   * Handles entering and leaving the Ghost House after a ghost is eaten
   * @param {({x: number, y: number})} gridPosition - x-y position during the current frame
   * @returns {({x: number, y: number})}
   */
  handleGhostHouse(gridPosition:ObservablePoint):ObservablePoint {
    const gridPositionCopy = copyPosition(this, gridPosition);

    if (this.enteringGhostHouse(this.mode, gridPosition)) {
      this.direction = this.characterUtil!.directions.down;
      gridPositionCopy.x = 13.5;
      this.position = this.characterUtil!.snapToGrid(
        gridPositionCopy, this.direction, this.scaledTileSize,
      );
    }

    if (this.enteredGhostHouse(this.mode, gridPosition)) {
      this.direction = this.characterUtil!.directions.up;
      gridPositionCopy.y = 14;
      this.position = this.characterUtil!.snapToGrid(
        gridPositionCopy, this.direction, this.scaledTileSize,
      );
      this.mode = this.defaultMode;
      window.dispatchEvent(new Event('restoreGhost'));
    }

    if (this.leavingGhostHouse(this.mode, gridPosition)) {
      gridPositionCopy.y = 11;
      this.position = this.characterUtil!.snapToGrid(
        gridPositionCopy, this.direction, this.scaledTileSize,
      );
      this.direction = this.characterUtil!.directions.left;
    }

    return gridPositionCopy;
  }

  /**
   * Handle the ghost's movement when it is inbetween tiles on the x-y grid of the Maze Array
   * @param {number} elapsedMs - The amount of MS that have passed since the last update
   * @param {({x: number, y: number})} gridPosition - x-y position during the current frame
   * @param {number} velocity - The distance the character should travel in a single millisecond
   * @returns {({ top: number, left: number})}
   */
  handleUnsnappedMovement(elapsedMs:number, gridPosition:ObservablePoint, velocity:number):any {
    const gridPositionCopy = this.handleGhostHouse(gridPosition);

    const desired = this.characterUtil!.determineNewPositions( 
      this.position, this.direction, velocity, elapsedMs, this.scaledTileSize,
    );

    if (this.characterUtil!.changingGridPosition(
      gridPositionCopy, desired.newGridPosition,
    )) {
      return this.characterUtil!.snapToGrid(
        gridPositionCopy, this.direction, this.scaledTileSize,
      );
    }

    return desired.newPosition;
  }

  /**
   * Determines the new Ghost position
   * @param {number} elapsedMs
   * @returns {({ top: number, left: number})}
   */
  handleMovement(elapsedMs:number):ObservablePoint {
    let newPosition;

    const gridPosition = this.characterUtil!.determineGridPosition(
      this.position, this.scaledTileSize,
    );
    const pacmanGridPosition = this.characterUtil!.determineGridPosition(
      this.pacman.position, this.scaledTileSize,
    );
    const velocity = this.determineVelocity(
      gridPosition, this.mode,
    );

    const snapToGrid = this.characterUtil!.snapToGrid(
          gridPosition, this.direction, this.scaledTileSize,
        )

    if (this.idleMode) {
      newPosition = this.handleIdleMovement(
        elapsedMs, gridPosition, velocity,
      );
    } else if ( this.position.equals(snapToGrid)) {
      newPosition = this.handleSnappedMovement(
        elapsedMs, gridPosition, velocity, pacmanGridPosition,
      );
    } else {
      newPosition = this.handleUnsnappedMovement(
        elapsedMs, gridPosition, velocity,
      );
    }

    newPosition = this.characterUtil!.handleWarp(
      newPosition, this.scaledTileSize, this.mazeArray,
    );

    this.checkCollision(gridPosition, pacmanGridPosition);

    return newPosition;
  }

  /**
   * Changes the defaultMode to chase or scatter, and turns the ghost around
   * if needed
   * @param {('chase'|'scatter')} newMode
   */
  changeMode(newMode:string) {
    this.defaultMode = newMode;

    const gridPosition = this.characterUtil!.determineGridPosition(
      this.position, this.scaledTileSize,
    );

    if ((this.mode === 'chase' || this.mode === 'scatter')
      && !this.cruiseElroy) {
      this.mode = newMode;

      if (!this.isInGhostHouse(gridPosition)) {
        this.direction = this.characterUtil!.getOppositeDirection(
          this.direction,
        );
      }
    }
  }

  /**
   * Toggles a scared ghost between blue and white, then updates its spritsheet
   */
  toggleScaredColor() {
    this.scaredColor = (this.scaredColor === 'blue')
      ? 'white' : 'blue';
    this.setSpriteSheet(this.name!, this.direction, this.mode);
  }

  /**
   * Sets the ghost's mode to SCARED, turns the ghost around,
   * and changes spritesheets accordingly
   */
  becomeScared() {
    const gridPosition = this.characterUtil!.determineGridPosition(
      this.position, this.scaledTileSize,
    );

    if (this.mode !== 'eyes') {
      if (!this.isInGhostHouse(gridPosition) && this.mode !== 'scared') {
        this.direction = this.characterUtil!.getOppositeDirection(
          this.direction,
        );
      }
      this.mode = 'scared';
      this.scaredColor = 'blue';
      this.setSpriteSheet("scared", this.direction, this.mode);
    }
  }

  /**
   * Returns the scared ghost to chase/scatter mode and sets its spritesheet
   */
  endScared() {
    this.mode = this.defaultMode;
    this.setSpriteSheet(this.name!, this.direction, this.mode);
  }

  /**
   * Speeds up the ghost (used for Blinky as Pacdots are eaten)
   */
  speedUp() {
    this.cruiseElroy = true;

    if (this.defaultSpeed === this.slowSpeed) {
      this.defaultSpeed = this.mediumSpeed;
    } else if (this.defaultSpeed === this.mediumSpeed) {
      this.defaultSpeed = this.fastSpeed;
    }
  }

  /**
   * Resets defaultSpeed to slow and updates the spritesheet
   */
  resetDefaultSpeed() {
    this.defaultSpeed = this.slowSpeed;
    this.cruiseElroy = false;
    this.setSpriteSheet(this.name!, this.direction, this.mode);
  }

  /**
   * Sets a flag to indicate when the ghost should pause its movement
   * @param {Boolean} newValue
   */
  pause(newValue:boolean) {
    this.paused = newValue;
  }

  /**
   * Checks if the ghost contacts Pacman - starts the death sequence if so
   * @param {({x: number, y: number})} position - An x-y position on the 2D Maze Array
   * @param {({x: number, y: number})} pacman - Pacman's current x-y position on the 2D Maze Array
   */
  checkCollision(position:ObservablePoint, pacman:ObservablePoint) {
    //if pacman is not allowing collision, then, he doesn't die!
    if (!this.pacman.allowCollision) return
    if (this.calculateDistance(position, pacman) < 1
      && this.mode !== 'eyes'
      && this.allowCollision) {
      if (this.mode === 'scared') {
        this.emitter.emit("ghost-eaten-"+this.name, {ghost: this})
        this.mode = 'eyes';
      } else {        
        this.emitter.emit("pacman-death")                
      }
    }
  }

  /**
   * Determines the appropriate speed for the ghost
   * @param {({x: number, y: number})} position - An x-y position on the 2D Maze Array
   * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
   * @returns {number}
   */
  determineVelocity(position:ObservablePoint, mode:string):any {
    if (mode === 'eyes') {
      return this.eyeSpeed;
    }

    if (this.paused) {
      return 0;
    }

    if (this.isInTunnel(position) || this.isInGhostHouse(position)) {
      return this.transitionSpeed;
    }

    if (mode === 'scared') {
      return this.scaredSpeed;
    }

    return this.defaultSpeed;
  }

  onEaten(detail:any) {
    window.dispatchEvent(new CustomEvent('eatGhost', {
          detail: detail 
    }));  
  }
  /**
   * Updates the css position, hides if there is a stutter, and animates the spritesheet
   * @param {number} interp - The animation accuracy as a percentage
   */
  draw(interp:number) {
    // const newY = this.characterUtil!.calculateNewDrawValue(
    //   interp, 'y', this.oldPosition, this.position,
    // );
    // const newX = this.characterUtil!.calculateNewDrawValue(
    //   interp, 'x', this.oldPosition, this.position,
    // );

    // this.sprite!.position.set(newX, newY)

    this.visible = this.display

    const updatedProperties = this.characterUtil!.advanceSpriteSheet(this);
    this.msSinceLastSprite = updatedProperties.msSinceLastSprite;
    this.frame = updatedProperties.frame

    let emotion = this.emotion
    let scared = this.scaredColor == "blue" ? "scared" : "scaredWhite"
    if (this.mode == "scared")
      emotion = scared
    else if (this.mode == 'eyes')
      emotion = 'eyes'
    this.setTexture(this.name!, this.direction, updatedProperties.frame, emotion)
  }

  /**
   * Handles movement logic for the ghost
   * @param {number} elapsedMs - The amount of MS that have passed since the last update
   */
  update(elapsedMs:number) {
    super.update(elapsedMs)
    this.oldPosition = createObservablePoint(this,this.position.x, this.position.y);

    if (this.moving) {
      this.position = this.handleMovement(elapsedMs);
      this.setSpriteSheet(this.name!, this.direction, this.mode);
      this.msSinceLastSprite += elapsedMs;
    } 
  }
}
//removeIf(production)
export default Ghost
//endRemoveIf(production)
