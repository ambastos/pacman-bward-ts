import WaveManager from "../core/waveManager.ts"
import Flood from "../core/flood.ts"

const States = {
    IDLE_STATE:0, 
    START_STATE:1, 
    END_STATE:2,
    CANCEL_STATE: 3,
}

class State {      
    drownManager:WaveManager
    started = false
    flood:Flood
    constructor(drownManager:WaveManager) {
        this.drownManager = drownManager
        this.started = false
        this.flood = drownManager.flood
    }
    start() {
        this.started = true
    }
    stop() {
        this.started = false
    }
    generateWave(timeToStartMS?:number) {

    }
    update(elapsedMs: number) {        
    }
    draw() {
    }
}
export {State, States}