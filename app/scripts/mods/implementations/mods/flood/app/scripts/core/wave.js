import { Sprite, Texture } from "pixi.js"

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
    cancel() {
        this.started = false
    }
    show() {
        this.visible = true
    }
}
export default Wave