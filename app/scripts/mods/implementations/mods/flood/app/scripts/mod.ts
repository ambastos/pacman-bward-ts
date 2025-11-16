import EventEmitter from "eventemitter3"
import GameCoordinator from "../../../../../../core/gameCoordinator.js"

/**
 * Module class to pacmam-bward game
 */
class Mod {
    emitter!:EventEmitter 
    gc:GameCoordinator
    started = false
    paused = false
    initialized = false
    scale:number = 1
    constructor(gameCoordinator:GameCoordinator) {
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
   
    update(elapsedMs:number) {

    }
    draw() {

    }
}
export default Mod