class Entity {
    name
    emitter
    gameCoordinator
    constructor(gameCoordinator, name, characterUtil) {
        this.gameCoordinator = gameCoordinator
        this.name = name
        this.characterUtil = characterUtil
        this.emitter = this.gameCoordinator.emitter
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