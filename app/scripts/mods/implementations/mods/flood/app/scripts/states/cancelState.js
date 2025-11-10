import { State } from "./state.js"
class CancelState extends State {
     constructor(factory) {
        super(factory)
    }  
    start() {
        super.start()
        if (this.factory.wave)
            this.factory.wave.speedY*=3
    }  
    endFlood() {
        const wave = this.factory.wave
        wave.height = -1
        this.factory.wave.cancel()
        this.flood.container.removeChild(wave)
    //    console.log("wave ends")
        this.factory.resetEntitiesBreathing()
        this.factory.nextWaveTime = null
        this.factory.wave = null
        this.flood.stop()
        // this.flood.pacman.moving = true
        // this.flood.ghosts.forEach(g=>{
        //     g.moving = true
        // })
        setTimeout(()=>{
            this.factory.gc.startGameplay()
        }, 2250)
    }
    update(elapsedMs) {        
        if (!this.started) return
        super.update(elapsedMs)
        const wave = this.factory.wave
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