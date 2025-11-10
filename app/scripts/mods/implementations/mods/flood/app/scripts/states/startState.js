import StateFactory from "./stateFactory.js"
import {State, States} from './state.js'
class StartState extends State {
    constructor(factory) {
        super(factory)
    }    
    update(elapsedMs) {        
        if (!this.started) return
        super.update(elapsedMs)
        const wave = this.factory.wave
        if (!wave) return
        if ( !wave.started) {
            wave.startTime = Date.now()
            wave.started = true 
            wave.show()
        }
        let isTimeLimited = (Date.now() - wave.startTime)  >= wave.duration

        wave.increase(elapsedMs)
        if (wave.height >= this.factory.maxHeight ||isTimeLimited) 
            this.flood.changeState(States.END_STATE)
    } 
    draw() {
        if (!this.started) return
    }
}
export default StartState