import WaveManager from '../core/waveManager.ts'
import Wave from '../core/wave.ts'
import {State, States} from './state.ts'
class IdleState extends State {    
    constructor(drownManager: WaveManager) {
        super(drownManager)        
    }    
    generateWave(timeToStartMS?: number) {
        const maze = this.drownManager.gc.maze
        const width = this.drownManager.gc.width
        this.drownManager.wave = new Wave(this.drownManager, maze!, width, 0)
        const wave = this.drownManager.wave
        //this.flood.container.children.length = 1        
        this.flood.container.addChildAt(wave,0)

        let waveTimeMs 
        if(timeToStartMS! >=0)
            waveTimeMs = timeToStartMS
        else 
            while ((waveTimeMs = Math.random() * 15) <=10 ){}   
        //between 15 and 40 seconds to generate a new wave     
        this.drownManager.waveTime = waveTimeMs! * 1000

        let durationMs
        while ((durationMs = Math.random() * 20) <=10 ){}
        //the duration of the wave is between 8 and 20 seconds
        wave.duration = durationMs * 1000
        this.drownManager.nextWaveTime = Date.now()+ this.drownManager.waveTime
    }
    start() {
        if (this.drownManager)
            this.drownManager.stop()
        super.start()
    }
    update(elapsedMs: number) {        
        if (!this.started) return
        super.update(elapsedMs)
        if (!this.drownManager.nextWaveTime) this.generateWave()
        const wave = this.drownManager.wave    
        if (wave &&  !wave.started) {
            if ( 
                this.drownManager.gc.gameEngine.started &&
                this.drownManager.gc.allowKeyPresses &&
             (this.drownManager.nextWaveTime && Date.now() >= this.drownManager.nextWaveTime) ) {            
                this.flood.changeState(States.START_STATE)
            }
        }
    } 
    draw() {
        if (!this.started) return
    }
}
export default IdleState