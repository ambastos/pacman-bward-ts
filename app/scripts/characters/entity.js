import { Rectangle } from "pixi.js"

class Entity {
    name
    allowCollision = true
    emitter
    gameCoordinator
    scaledTileSize
    sprite
    hitArea
    constructor(gameCoordinator, name, characterUtil) {
        this.gameCoordinator = gameCoordinator
        this.name = name
        this.scaledTileSize = gameCoordinator.scaledTileSize        
        this.characterUtil = characterUtil
        this.emitter = this.gameCoordinator.emitter
    }
    getGridPosition() {
        return this.characterUtil.determineGridPosition(
            this.position, this.scaledTileSize)
    }
    registerEventListeners() {
        
    }
    onReset() {

    }    
    onDeath() {

    }
    update(elapsedMs) {
        if (this.sprite) {
            const half = this.scaledTileSize * 0.5
            const x = this.sprite.x + this.sprite.width * 0.5 - half
            const y = this.sprite.y + this.sprite.height * 0.5 - half  
            this.sprite.hitArea = 
                new Rectangle(x, y, this.scaledTileSize, this.scaledTileSize) 
            this.hitArea = this.sprite.hitArea
        }
    }
    draw(interp) {

    }
}
export default Entity