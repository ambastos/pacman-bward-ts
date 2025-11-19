import DrownManager from '../core/drownManager.ts'
import {State, States} from './state.ts'
class StartState extends State {
    constructor(drownManager: DrownManager) {
        super(drownManager)
    }    
    update(elapsedMs: number) {        
        if (!this.started) return
        super.update(elapsedMs)
        const wave = this.drownManager.wave
        if (!wave) return
        if ( !wave.started) {
            wave.startTime = Date.now()
            wave.started = true 
            wave.show()
        }
        let isTimeLimited = (Date.now() - wave.startTime)  >= wave.duration

        wave.increase(elapsedMs)
        if (wave.height >= this.drownManager.maxHeight ||isTimeLimited) 
            this.flood.changeState(States.END_STATE)
    } 
    draw() {
        if (!this.started) return
    }
}
export default StartState