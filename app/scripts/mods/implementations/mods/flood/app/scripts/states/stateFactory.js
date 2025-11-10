const breathNamespace = "breath"
class StateFactory {
    wave = null
    waveTime = null
    nextWaveTime = null
    maxHeight  
    gc
    constructor(flood) {
        this.flood = flood      
        this.maxHeight = flood.maxHeight
        this.gc = flood.gc
        this.gp = flood.gp
    }    
    resetEntitiesBreathing() {
        this.#resetEntity(this.flood.pacman)        
    }
    #resetEntity(entity) {        
        entity[breathNamespace].reset()
    }
    clear() {
        if (this.wave)
            this.flood.container.removeChild(this.wave)
    }
    stop() {
        this.wave = null
        this.waveTime = null        
    }
    update(elapsedMs) {        
        if (!this.started) return
    }
    draw() {
        if (!this.started) return
    }
}
export default StateFactory
