import { Container, RenderTexture, Sprite, Texture } from "pixi.js";
import Entity from "../characters/entity.js";

class Pickup extends Entity {
  constructor(type, column, row, points, gameCoordinator) {
    super(gameCoordinator, "pickup", null)
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
    this.sprite.visible = (this.type === 'fruit') ? false : true
    this.animationTarget.style.visibility = (this.type === 'fruit')
      ? 'hidden' : 'visible';

  }

  /**
   * Sets various style measurements for the pickup depending on its type
   * @param {('pacdot'|'powerPellet'|'fruit')} type - The classification of pickup
   * @param {number} scaledTileSize
   * @param {number} column
   * @param {number} row
   * @param {number} points
   */
  setStyleMeasurements(type, scaledTileSize, column, row, points) {
    if (type === 'pacdot') {
      this.size = scaledTileSize * 0.25;
      this.x = (column * scaledTileSize) + ((scaledTileSize / 8) * 3);
      this.y = (row * scaledTileSize) + ((scaledTileSize / 8) * 3);
    } else if (type === 'powerPellet') {
      this.size = scaledTileSize;
      this.x = (column * scaledTileSize);
      this.y = (row * scaledTileSize);
    } else {
      this.size = scaledTileSize * 2;
      this.x = (column * scaledTileSize) - (scaledTileSize * 0.5);
      this.y = (row * scaledTileSize) - (scaledTileSize * 0.5);
    }

    this.center = {
      x: column * scaledTileSize,
      y: row * scaledTileSize,
    };

    this.animationTarget = document.createElement('div');
    this.animationTarget.style.position = 'absolute';
    this.animationTarget.style.backgroundSize = `${this.size}px`;

    this.setSprite(type)
    this.sprite.visible = false
    this.sprite.position.set(this.x, this.y)

    this.animationTarget.style.backgroundImage = this.determineImage2(
      type, points,
    );
    this.animationTarget.style.height = `${this.size}px`;
    this.animationTarget.style.width = `${this.size}px`;
    this.animationTarget.style.top = `${this.y}px`;
    this.animationTarget.style.left = `${this.x}px`;
    this.mazeDiv.appendChild(this.animationTarget);
    this.animationTarget.style.visibility = "hidden"
    
    if (type === 'powerPellet') {
      this.animationTarget.classList.add('power-pellet');
    }

    this.reset();
  }

  /**
   * Determines the Pickup image based on type and point value
   * @param {('pacdot'|'powerPellet'|'fruit')} type - The classification of pickup
   * @param {Number} points
   * @returns {String}
   */
  determineImage2(type, points) {
    let image = '';

    if (type === 'fruit') {
      image = this.fruitImages[points] || 'cherry';
    } else {
      image = type;
    }

    return `url(app/style/graphics/spriteSheets/pickups/${image}.svg)`;
  }
  getFruitName(points) {
    return this.fruitImages[points]
  }

  getTexture(type) {
    let frameY = 0
    let frameX = 0
    let spWidth = this.gameCoordinator.scaledTileSize * this.gameCoordinator.scale
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
      let w = this.gameCoordinator.scaledTileSize * this.gameCoordinator.scale      
      return this.gameCoordinator.am.getTexture("pickups",frameX, frameY,w,w,spWidth, spWidth)
  }
  setSprite(type) {
    const texture = this.getTexture(type)
    if(!this.sprite)
      this.sprite = new Sprite(texture)
    else
      this.sprite.texture = texture
  }
  /**
   * Shows a bonus fruit, resetting its point value and image
   * @param {number} points
   */
  showFruit(points) {
    this.points = points;
    this.animationTarget.style.backgroundImage = this.determineImage2(
      this.type, points,
    );

    const tx = this.gameCoordinator.am.getTexture(this.getFruitName(points))
    this.sprite.texture = tx
    this.sprite.visible = true
    this.animationTarget.style.visibility = 'visible';
  }

  /**
   * Makes the fruit invisible (happens if Pacman was too slow)
   */
  hideFruit() {
    this.sprite.visible = false
    this.animationTarget.style.visibility = 'hidden';
  }

  /**
   * Returns true if the Pickup is touching a bounding box at Pacman's center
   * @param {({ x: number, y: number, size: number})} pickup
   * @param {({ x: number, y: number, size: number})} originalPacman
   */
  checkForCollision(pickup, originalPacman) {
    const pacman = Object.assign({}, originalPacman);

    pacman.x += (pacman.size * 0.25);
    pacman.y += (pacman.size * 0.25);
    pacman.size /= 2;

    return (pickup.x < pacman.x + pacman.size
      && pickup.x + pickup.size > pacman.x
      && pickup.y < pacman.y + pacman.size
      && pickup.y + pickup.size > pacman.y);
  }

  /**
   * Checks to see if the pickup is close enough to Pacman to be considered for collision detection
   * @param {number} maxDistance - The maximum distance Pacman can travel per cycle
   * @param {({ x:number, y:number })} pacmanCenter - The center of Pacman's hitbox
   * @param {Boolean} debugging - Flag to change the appearance of pickups for testing
   */
  checkPacmanProximity(maxDistance, pacmanCenter, debugging) {
    if (this.sprite.visible) {
    //if (this.animationTarget.style.visibility !== 'hidden') {
      const distance = Math.sqrt(
        ((this.center.x - pacmanCenter.x) ** 2)
        + ((this.center.y - pacmanCenter.y) ** 2),
      );

      this.nearPacman = (distance <= maxDistance);

      if (debugging) {
        this.sprite.tint = this.nearPacman
           ? '0x00ff00' : '0xff0000';
        this.animationTarget.style.background = this.nearPacman
          ? 'lime' : 'red';
      }
    }
  }

  /**
   * Checks if the pickup is visible and close to Pacman
   * @returns {Boolean}
   */
  shouldCheckForCollision() {
    return this.sprite.visible && this.nearPacman
    //return this.animationTarget.style.visibility !== 'hidden'
       && this.nearPacman;
  }

  /**
   * If the Pickup is still visible, it checks to see if it is colliding with Pacman.
   * It will turn itself invisible and cease collision-detection after the first
   * collision with Pacman.
   */
  update() {
    if (this.shouldCheckForCollision()) {
      super.update()
      if (this.checkForCollision(
        {
          x: this.x,
          y: this.y,
          size: this.size,
        }, {
          x: this.pacman.position.left,
          y: this.pacman.position.top,
          size: this.pacman.measurement,
        },
      )) {
        this.sprite.visible = false
        this.animationTarget.style.visibility = 'hidden';
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
//Just to avoid problems with NYC coverage test
if (!process.env.NYC_PROCESS_ID) 
  global.window.Pickup = Pickup
// removeIf(production)
//module.exports = Pickup;
export default Pickup
// endRemoveIf(production)