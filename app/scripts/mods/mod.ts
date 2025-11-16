import EventEmitter from "eventemitter3"
import GameCoordinator from "../core/gameCoordinator.js"

/**
 * Module class to pacmam-bward game
 */
class Mod {
    emitter:EventEmitter 
    started:boolean = false
    paused:boolean = false
    initialized:boolean = false
    scale:number = 1
    gc:GameCoordinator
    constructor(gameCoordinator:GameCoordinator) {
        this.gc = gameCoordinator   
        this.emitter = this.gc.emitter     
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