import StateFactory from "./stateFactory.js"
import {State, States} from './state.js'
class EndState extends State {
    constructor(factory) {
        super(factory)
    }    
    terminateWave() {
        const wave = this.factory.wave
        wave.height = -1
        this.flood.container.removeChild(wave)
    //    console.log("wave ends")
        this.flood.resetEntitiesBreathing()
        this.factory.nextWaveTime = null
        this.factory.wave = null
    }
    update(elapsedMs) {        
        if (!this.started) return
        super.update(elapsedMs)
        const wave = this.factory.wave
        if (!wave) return
        wave.decrease(elapsedMs)       
        if (wave.isDescreasing && wave.height < 5) 
            this.terminateWave()             
    } 
    draw() {
        if (!this.started) return
    }
}
export default EndState