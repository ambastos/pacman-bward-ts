import WavesManager from "../core/wavesManager.ts"
import { State } from "./state.ts"
class CancelState extends State {
     constructor(wavesManager: WavesManager) {
        super(wavesManager)
    }  
    start() {
        super.start()
        console.log("start cancel", Date.now())
        if (this.wavesManager.wave)
            this.wavesManager.wave.speedY*=3
    }  
    endFlood() {
        const wave = this.wavesManager.wave
        if (!wave) return
        wave.height = -1
        this.wavesManager.wave!.cancel()
        this.flood.container.removeChild(wave)
    //    console.log("wave ends")
        this.wavesManager.resetEntitiesBreathing()
        this.wavesManager.nextWaveTime = null
        this.wavesManager.wave = null
        this.flood.stop()
        // this.flood.pacman.moving = true
        // this.flood.ghosts.forEach(g=>{
        //     g.moving = true
        // })
        console.log("end cancel", Date.now())
        setTimeout(()=>{ 
            this.flood.emitter.emit("start")
            //this.flood.emitter.emit("flood-start")
        }, 2250)
    }
    update(elapsedMs: number) {        
        if (!this.started) return
        super.update(elapsedMs)
        const wave = this.wavesManager.wave
        if (!wave) return

        wave.decrease(elapsedMs)
        // this.flood.pacman.moving = false
        // this.flood.ghosts.forEach(g=>{
        //     g.moving = false
        // })

        if (wave.isDescreasing && wave.height < 5) 
            this.endFlood()             
    } 
    draw() {
        if (!this.started) return
    }
}
export default CancelState