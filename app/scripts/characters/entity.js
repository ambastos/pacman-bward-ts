class Entity {
    name
    allowCollision = true
    emitter
    gameCoordinator
    scaledTileSize
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

    }
    draw(interp) {

    }
}
export default Entity