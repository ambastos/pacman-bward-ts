import EventEmitter from "eventemitter3"
import GameCoordinator from "../../../../../../scripts/core/gameCoordinator.ts"

/**
 * Module class to pacmam-bward game
 */
abstract class Mod {
    protected abstract name: string 
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
    getResources() {
        return []
    }
    async loadAssets(callback:unknown):Promise<Record<string, any>|null> {
      return null
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