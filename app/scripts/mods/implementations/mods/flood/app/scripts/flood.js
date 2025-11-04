import { Container, Sprite, Texture } from "pixi.js"
import Mod from "./mod"
import Pacman from "../../../../../../characters/pacman.js"

/**
 * name spacing used to create the needed properties
 */
const breathNamespace = "breath"
class Flood extends Mod{
    constructor(gameCoordinator) {
        super(gameCoordinator)
        this.width = gameCoordinator.width
        this.maxHeight = gameCoordinator.height
        this.tileSize = this.gc.tileSize
        this.container = new Container()
        this.nextWaveTime
        this.lives = 10
        console.log("lives for debugging ", this.lives)
    }
    initialize() {
        this.pacman = this.gc.pacman
        this.ghosts = this.gc.ghosts
        this.#createNewProperties(this.pacman, {
            breathing: 5,
            maxBreathing: 10,
            decreaseVelocityPerMs: 0.8,                        
        })  
        this.ghosts.forEach(g=>{
            this.#createNewProperties(g)
        })        
    }
    #createNewProperties(entity, options) {               
        entity[breathNamespace] = new Breath(options)
    }
    start() {
        super.start()
        this.pacman = this.gc.pacman
        this.ghosts = this.gc.ghosts
        this.gc.stage.removeChild(this.container)
        this.gc.stage.addChild(this.container)
    } 
    stop() { 
        super.stop()
        this.container.children.length = 0
        this.nextWaveTime = null
        this.wave = null
        this.pacman = null
        this.ghosts = null
    }
    startWave() {
        if (this.wave &&  !this.wave.started) {
            if (this.nextWaveTime && Date.now() >= this.nextWaveTime) {            
                this.wave.startTime = Date.now()
                this.wave.started = true 
                this.wave.show()
//                console.log("start wave", this.wave.startTime)
            }
        }
    }
    generateWave(timeToStartMS) {
        this.wave = new Wave(this.gc.mazeSprite, this.width, 0)
        this.container.addChild(this.wave)

        let waveTimeMs 
        if(timeToStartMS >=0)
            waveTimeMs = timeToStartMS
        else 
            while ((waveTimeMs = Math.random() * 40) <=15 ){}        
        this.waveTime = waveTimeMs * 1000

        let durationMs
        while ((durationMs = Math.random() * 20) <=8 ){}
        this.wave.duration = durationMs * 1000
        // this.waveTimer = setTimeout(()=>{
        //     this.startWave()
        // }, this.waveTime)
        this.nextWaveTime = Date.now()+ this.waveTime
  //      console.log("next wave will start/during: ", this.waveTime, this.wave.duration)
    }
    endWave() {
        this.container.removeChild(this.wave)
    //    console.log("wave ends")
        this.resetEntitiesBreathing()
        this.nextWaveTime = null
        this.wave = null
    }
    resetEntitiesBreathing() {
        this.#resetEntity(this.pacman)        
    }
    #resetEntity(entity) {        
        entity[breathNamespace].reset()
    }
    stopDrown(entity) {
        entity[breathNamespace].stopped = true
    }
    startDrownEntity(entity, elapsedMs) {
        const breath = entity[breathNamespace]
        if (!this.wave || !this.wave.started || breath.stopped) return

        const sprite = entity.sprite.getBounds()
        if (this.wave.getBounds().contains(sprite.x, sprite.y) ){
            breath.elapsedTimeLastBreathMs+=elapsedMs
            if (breath.elapsedTimeLastBreathMs >=1000) {
                breath.elapsedTimeLastBreathMs = 0
                breath.breathing -= 1
                if (breath.breathing <= 0) {
                    breath.breathing = 0
                    this.killEntity(entity)                                        
                }
                console.log(entity.constructor.name, "breathing: ", breath.breathing)
            }
        }else {
            breath.elapsedTimeLastBreathMs+=elapsedMs
            if (breath.elapsedTimeLastBreathMs >=300) {
                breath.breathing +=1
                breath.elapsedTimeLastBreathMs = 0
                if (breath.breathing >= breath.defaultBreathing) 
                    breath.breathing = breath.defaultBreathing
                console.log(entity.constructor.name, "breathing: ", breath.breathing)
            }
        }
    }
    killEntity(entity) {
        const breath = entity[breathNamespace]
        if (entity instanceof Pacman ) {
            window.dispatchEvent(new Event('deathSequence'));
            breath.stop()
            breath.reset()
            this.endWave()
        }
        console.log(entity.constructor.name, " is drowned!")
    }
    update(elapsedMs) {
        if (!this.started) return
        if (!this.nextWaveTime) this.generateWave()
        
        this.startWave()
        if (this.wave.started) { 
            let isTimeLimited = (Date.now() - this.wave.startTime)  >= this.wave.duration
            if (this.wave.isDescreasing && this.wave.height < 5) 
                this.endWave()        
            else if (this.wave.height >= this.maxHeight ||isTimeLimited)
                this.wave.decrease(elapsedMs)
            else 
                this.wave.increase(elapsedMs)

            //start to drown Pacman
            this.startDrownEntity(this.pacman, elapsedMs)
            
        }
    }
    draw() {
        if (!this.started) return
    }
}

class Wave extends Sprite {
    speedY = 15    
    startTime = 0
    started = false
    decreasing = false
    constructor(mazeSprite, width, height) {        
        super(Texture.WHITE)   
        this.width = width
        this.height = height 
        this.visible = false   
        this.alpha = 0.5    
        this.mazeSprite = mazeSprite            
    }
    increase(elapsedMs) {
        if (this.visible) {
            this.height+=this.speedY * (elapsedMs/1000)
            this.decreasing = false
            this.updatePosition()
            //console.log("increase wave: ", this.height, this.position)
        }
    }
    decrease(elapsedMs) {
        if (this.visible) {            
            this.height -=this.speedY * 1.3 * (elapsedMs/1000)
            this.decreasing = true
            this.updatePosition()
            //console.log("decrease wave: ", this.height, this.position)
        }
    }
    updatePosition() {
        this.y = this.mazeSprite.height - this.height
    }
    get isDescreasing() {
        return this.decreasing
    }
    show() {
        this.visible = true
    }
}

class Breath {
    stopped = false
    constructor(options) {
         let defaultOptions = {
            breathing: 5, 
            maxBreathing: 10,
            decreaseVelocityPerMs: 0.7,     
            invincible: false,
            elapsedTimeLastBreathMs: null,       
        }

        for (let opt in options) 
            defaultOptions[opt] = options[opt]
        for (let opt in defaultOptions) 
            this[opt] = defaultOptions[opt] 
        this.defaultBreathing = this.breathing
    }
    reset() {
        this.breathing = this.defaultBreathing
        this.stopped = false
    }
    stop() {
        this.stopped = true
    }
}

if (!process.env.NYC_PROCESS_ID) 
  global.window.Flood = Flood
//removeIf(production)
export default Flood
//endRemoveIf