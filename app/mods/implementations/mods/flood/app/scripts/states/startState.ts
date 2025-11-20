import WavesManager from '../core/wavesManager.ts'
import {State, States} from './state.ts'
class StartState extends State {
    constructor(wavesManager: WavesManager) {
        super(wavesManager)
    }    
    update(elapsedMs: number) {        
        if (!this.started) return
        super.update(elapsedMs)
        const wave = this.wavesManager.wave
        if (!wave) return
        if ( !wave.started) {
            wave.startTime = Date.now()
            wave.started = true 
            wave.show()
        }
        let isTimeLimited = (Date.now() - wave.startTime)  >= wave.duration

        wave.increase(elapsedMs)
        if (wave.height >= this.wavesManager.maxHeight ||isTimeLimited) 
            this.flood.changeState(States.END_STATE)
    } 
    draw() {
        if (!this.started) return
    }
}
export default StartState