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
    }    
    resetEntitiesBreathing() {
        this.#resetEntity(this.flood.pacman)        
    }
    #resetEntity(entity) {        
        entity[breathNamespace].reset()
    }
    clear() {
        this.flood.container.children.length=0
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
