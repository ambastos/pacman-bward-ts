import type WavesManager from "../core/wavesManager.ts"
import type Flood from "../core/flood.ts"

const States = {
    IDLE_STATE:0, 
    START_STATE:1, 
    END_STATE:2,
    CANCEL_STATE: 3,
}

class State {      
    wavesManager:WavesManager
    started = false
    flood:Flood
    className: string = ""
    constructor(wavesManager:WavesManager) {
        this.wavesManager = wavesManager
        this.started = false
        this.flood = wavesManager.flood
        //@ts-ignore
        this.className = this.__proto__.name        
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