import { Sprite, Texture } from "pixi.js";
import Flood from "../core/flood.js";
import Wave from "../core/wave.js";
import Animator from "../animations/animator.js";
import Entity from "./entity.js";

class Sonic extends Sprite implements Entity{
    flood: Flood;
    animator:Animator
    constructor(flood:Flood) {        
        super()        
        this.flood = flood        
        this.scale.set(flood.scale)
        this.setTexture(0,1, 32, 32) 
        this.animator = new Animator(this)

        this.animator.createAnimation("run",200, 10000, ()=>{
            //TODO improve it using the functions in characterUtil(snapToGrid, etc)
            const an = this.animator.animations.get("run")
            an.maxFrames = 8
            if (!an.frame)
                an.frame = 0
            else  
                an.frame++
            if (an.frame == an.maxFrame) {
                an.frame = 0
            } 
            this.setTexture(an.frame, 1,32,32)
            this.position.x+=this.width*0.2
        })
        //this.animator.play("run")
    }
    setTexture(frameX:number, frameY:number, width:number, height:number) {
        this.texture = this.flood.am.getTexture("sonic", frameX, frameY,
            width, height 
        ) as Texture        
    }
    update(elapsedMs:number) {
        //this.animator.play("run") 
    }
}
export default Sonic