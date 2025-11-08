/**
 * Module class to pacmam-bward game
 */
class Mod {
    emitter 
    started = false
    paused = false
    initialized = false
    constructor(gameCoordinator) {
        this.gc = gameCoordinator
    }
    initialize() {
        this.initialized = true
    }
    reset() {

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