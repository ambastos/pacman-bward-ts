import { Container, ObservablePoint, RenderTexture, Sprite, Texture } from "pixi.js";
import StaticEntity from "../characters/staticEntity.ts";
import GameCoordinator from "../core/gameCoordinator.ts";
import Pacman from "../characters/pacman.ts";

class Pickup extends StaticEntity {
  type:string
  pacman:Pacman
  mazeDiv:any
  points:number
  nearPacman:boolean;
  sprites:[] | null   
  fruitImages:any
  size!:number
  center:any
  constructor(type:string, column:number, row:number, 
    points:number, gameCoordinator:GameCoordinator) {
    super(gameCoordinator, "pickup")
    this.type = type;
    this.pacman = gameCoordinator.pacman;
    this.mazeDiv = gameCoordinator.mazeDiv;
    this.points = points;
    this.nearPacman = false;
    this.sprites = null
    
    this.fruitImages = {
      100: 'cherry',
      300: 'strawberry',
      500: 'orange',
      700: 'apple',
      1000: 'melon',
      2000: 'galaxian',
      3000: 'bell',
      5000: 'key',
    };

    this.setStyleMeasurements(type, gameCoordinator.scaledTileSize, column, row, points);
  }

  /**
   * Resets the pickup's visibility
   */
  reset() {
    this.visible = (this.type === 'fruit') ? false : true
    super.reset()
  }

  /**
   * Sets various style measurements for the pickup depending on its type
   * @param {('pacdot'|'powerPellet'|'fruit')} type - The classification of pickup
   * @param {number} scaledTileSize
   * @param {number} column
   * @param {number} row
   * @param {number} points
   */
  setStyleMeasurements(type:string, scaledTileSize:number, 
      column:number, row:number, points:number) {
    let ax=0, ay = 0    
    if (type === 'pacdot') {
      this.size = scaledTileSize * 0.25;
      ax = this.anchor.x * this.size * this.gameCoordinator.scale
      ay = this.anchor.y * this.size * this.gameCoordinator.scale
      this.x = (column * scaledTileSize) + ((scaledTileSize / 8) * 3) + ax;
      this.y = (row * scaledTileSize) + ((scaledTileSize / 8) * 3) + ay;
    } else if (type === 'powerPellet') {
      this.size = scaledTileSize;
      ax = this.anchor.x * scaledTileSize * 0.5 * this.gameCoordinator.scale
      ay = this.anchor.y * scaledTileSize * 0.5 * this.gameCoordinator.scale
      this.x = (column * scaledTileSize) + ax;
      this.y = (row * scaledTileSize) + ay;
    } else {
      this.size = scaledTileSize * 2;
      ax = this.anchor.x * scaledTileSize * this.gameCoordinator.scale
      ay = this.anchor.y * scaledTileSize * this.gameCoordinator.scale
      this.x = (column * scaledTileSize) - (scaledTileSize * 0.5) + ax;
      this.y = (row * scaledTileSize) - (scaledTileSize * 0.5) + ay;
    }

    this.center = {
      x: column * scaledTileSize,
      y: row * scaledTileSize,
    };
    this.setTexture(type)
    this.visible = false
    //this.position.set(this.x, this.y)
    
    if (type === 'powerPellet') {
      //Blink effect of the pellets
    }
    this.reset();
  }

  getFruitName(points:number) {
    return this.fruitImages[points]
  }

  getTexture(type:string) {
    let frameY = 0
    let frameX = 0
    let spWidth = 16 //this.gameCoordinator.scaledTileSize * this.gameCoordinator.scale
    switch (type) {
      case "pacdot":
        frameY = 0
        spWidth = 2
        break;
      case "powerPellet":
        frameY = 1
        spWidth = 8
        break;
      case "fruit":  
      case "cherry":
        frameY = 2
        break
      case "strawberry":
        frameY = 3
        break
      case "orange":
        frameY = 4
        break
      case "apple":
        frameY = 5
        break
      case "melon":
        frameY = 6
        break
      case "galaxian":
        frameY = 7
        break
      case "bell":
        frameY = 8
        break
      case "key":
        frameY = 9
        break        
      default:
          break;
        }
      let w = 16//this.gameCoordinator.scaledTileSize * this.gameCoordinator.scale      
      return this.gameCoordinator.am.getTexture("pickups",frameX, frameY,w,w,spWidth, spWidth)
  }
  setTexture(type:string) {
    this.texture = this.getTexture(type) as Texture
  }
  /**
   * Shows a bonus fruit, resetting its point value and image
   * @param {number} points
   */
  showFruit(points:number) {
    this.points = points;
    const tx = this.gameCoordinator.am.getTexture(this.getFruitName(points))
    this.texture = tx as Texture
    this.visible = true
  }

  /**
   * Makes the fruit invisible (happens if Pacman was too slow)
   */
  hideFruit() {
    this.visible = false
  }

  /**
   * Returns true if the Pickup is touching a bounding box at Pacman's center
   * @param {({ x: number, y: number, size: number})} pickup
   * @param {({ x: number, y: number, size: number})} originalPacman
   * @returns {boolean}
   */
  checkForCollision(pickup: Pickup, 
      originalPacman: Pacman):boolean {
    //const pacman = Object.assign({}, originalPacman);

    // pacman.x += (pacman.size * 0.25);
    // pacman.y += (pacman.size * 0.25);
    // pacman.size /= 2;
    

    // return (pickup.x < pacman.x + pacman.size
    //   && pickup.x + pickup.size > pacman.x
    //   && pickup.y < pacman.y + pacman.size
    //   && pickup.y + pickup.size > pacman.y);
    return pickup.hitArea!.intersects(this.pacman.hitArea!)
  }

  /**
   * Checks to see if the pickup is close enough to Pacman to be considered for collision detection
   * @param {number} maxDistance - The maximum distance Pacman can travel per cycle
   * @param {({ x:number, y:number })} pacmanCenter - The center of Pacman's hitbox
   * @param {Boolean} debugging - Flag to change the appearance of pickups for testing
   */
  checkPacmanProximity(maxDistance: number, pacmanCenter: ObservablePoint, debugging: boolean) {
    if (this.visible) {
      const distance = Math.sqrt(
        ((this.center.x - pacmanCenter.x) ** 2)
        + ((this.center.y - pacmanCenter.y) ** 2),
      );

      this.nearPacman = (distance <= maxDistance);

      if (debugging) {
        this.tint = this.nearPacman
           ? '0x00ff00' : '0xff0000';
      }
    }
  }

  /**
   * Checks if the pickup is visible and close to Pacman
   * @returns {Boolean}
   */
  shouldCheckForCollision():boolean {
    return this.visible && this.nearPacman
  }

  /**
   * If the Pickup is still visible, it checks to see if it is colliding with Pacman.
   * It will turn itself invisible and cease collision-detection after the first
   * collision with Pacman.
   */
  update(elapsedMs:number) {
    if (this.shouldCheckForCollision()) {
      super.update(elapsedMs)
      // if (this.checkForCollision(
      //   {
      //     x: this.x,
      //     y: this.y,
      //     size: this.size,
      //   }, {
      //     x: this.pacman.position.x,
      //     y: this.pacman.position.y,
      //     size: this.pacman.measurement,
      //   },
      // )) {
      if (this.checkForCollision(this, this.pacman)) { 
        this.visible = false
        this.emitter.emit("item-taken", this)
        window.dispatchEvent(new CustomEvent('awardPoints', {
          detail: {
            points: this.points,
            type: this.type,
          },
        }));

        if (this.type === 'pacdot') {
          window.dispatchEvent(new Event('dotEaten'));
        } else if (this.type === 'powerPellet') {
          window.dispatchEvent(new Event('dotEaten'));
          window.dispatchEvent(new Event('powerUp'));
        }
      }
    }
  }
}
// removeIf(production)
export default Pickup
// endRemoveIf(production)