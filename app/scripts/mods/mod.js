/**
 * Module class to pacmam-bward game
 */
class Mod {
    started = false
    paused = false
    constructor(gameCoordinator) {
        this.gc = gameCoordinator
    }
    initialize() {
    }
    start() {
        this.started = true
    }
    stop() {
        this.started = false
    }
    pause() {
        this.paused = true
    }
    unPause() {
        this.paused = false
    }
   
    update(elapsedMs) {

    }
    draw() {

    }
}
export default Mod