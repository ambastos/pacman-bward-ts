import WavesManager from "../core/wavesManager.ts"
import { State, States } from "./state.ts"
class CancelState extends State {
    constructor(wavesManager: WavesManager) {
        super(wavesManager)
    }
    start() {
        super.start()
        //console.log("start cancel", Date.now())
        //Aqui ele aumenta a velocidade da onda quando é cancelado
        //para baixar mais rápido
        if (this.wavesManager.wave)
            this.wavesManager.wave.speedY *= 3
    }
    endFlood() {
        const wave = this.wavesManager.wave
        if (wave) {
            wave.height = -1
            wave.started = false
            wave.cancel()
            if (wave.parent)
                wave.parent.removeChild(wave)
        }
        this.flood.gp.clear()
        //console.log("wave ends")
        this.wavesManager.resetEntitiesBreathing()
        this.wavesManager.nextWaveTime = null
        this.wavesManager.wave = null
        this.flood.stop()

        //só reinicia o ciclo se ainda houver vidas
        setTimeout(() => {
            if (this.flood.gc.lives > 0)
                this.flood.emitter.emit("start")
        }, 2250)
    }
    update(elapsedMs: number) {
        if (!this.started) return
        super.update(elapsedMs)
        const wave = this.wavesManager.wave
        if (!wave) return

        wave.decrease(elapsedMs)

        if (wave.isDescreasing && wave.height < 5)
            this.endFlood()
    }
    draw() {
        if (!this.started) return
    }
}
export default CancelState