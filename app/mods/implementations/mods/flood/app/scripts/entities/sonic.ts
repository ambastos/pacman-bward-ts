import { Resource, Sprite, Texture } from "pixi.js";
import Flood from "../core/flood.ts";
import Wave from "../core/wave.ts";
import Animator from "../animations/animator.ts";
import Entity from "./entity.ts";
import Ghost from "../../../../../../../scripts/characters/ghost.ts";
import CharacterUtil from "../../../../../../../scripts/utilities/characterUtil.ts";
import Pacman from "../../../../../../../scripts/characters/pacman.ts";
import { createObservablePoint } from "../../../../../../../scripts/utilities/utils.ts";

class Sonic extends Ghost {
    flood: Flood;
    animator:Animator
    frameY:number = 0
    constructor(flood:Flood) {        
        super(flood.gc,"sonic",flood.gc.level, new CharacterUtil())        
        this.name = "sonic"
        this.flood = flood        
        this.scale.set(flood.scale)
        this.setTexture(this.name, this.direction, 1, null, 1, 32, 32) 
        this.animator = new Animator(this)

        // this.animator.createAnimation("run",200, 10000, ()=>{
        //     //TODO improve it using the functions in characterUtil(snapToGrid, etc)
        //     const an = this.animator.animations.get("run")
        //     an.maxFrames = 8
        //     if (!an.frame)
        //         an.frame = 0
        //     else  
        //         an.frame++
        //     if (an.frame == an.maxFrame) {
        //         an.frame = 0
        //     } 
        //     this.setTexture(this.name!,this.direction, an.frame,null, 1,32,32)
        //     this.position.x+=this.width*0.2
        // })
        //this.animator.play("run")
    }    
    setDefaultMode(): void {
        this.allowCollision = false
        this.defaultMode = "idle"
        this.mode = "idle"
    }
    setMovementStats(pacman: Pacman, name: string, level: number): void {
        const pacmanSpeed = pacman.velocityPerMs;
        const levelAdjustment = level / 100;

        this.slowSpeed = pacmanSpeed * (0.75 + levelAdjustment);
        this.mediumSpeed = pacmanSpeed * (0.875 + levelAdjustment);
        this.fastSpeed = pacmanSpeed * (1 + levelAdjustment);

        if (!this.defaultSpeed) {
            this.defaultSpeed = this.slowSpeed;
        }

        this.scaredSpeed = pacmanSpeed * 0.5;
        this.transitionSpeed = pacmanSpeed * 0.4;
        this.eyeSpeed = pacmanSpeed * 2;

        this.velocityPerMs = this.defaultSpeed;
        this.moving = false;
        this.defaultDirection = this.characterUtil!.directions.left;
        this.direction = this.defaultDirection
    }
    setSpriteAnimationStats(): void {
        this.display = true
        this.loopAnimation = true;
        this.animate = true;
        this.msBetweenSprites = 250;
        this.msSinceLastSprite = 0;

        this.frame = 0
        this.frameY = 0
        this.spriteFrames = 7;
    }
    setDefaultPosition(scaledTileSize: number, name: string): void {
        const gridPosition = this.getGridPosition()
        this.defaultPosition = createObservablePoint(this,
            gridPosition.x,
            gridPosition.y
        );
    }
    setStyleMeasurements(scaledTileSize: number, spriteFrames: number): void {
        this.measurement = this.scaledTileSize * 2
    }
    setSpriteSheet(name: string, direction: string, mode: string): void {
        // let w = this.gameCoordinator.scaledTileSize * this.gameCoordinator.scale    
        // this.setTexture(name, direction,this.frame, "", this.frameY,w,w)     
    }
    setTexture(name:string, direction:string,frameX:number, 
        emotion:string | null, frameY?:number, width?:number, height?:number):void {            
        this.texture = this.flood.am.getTexture(name, frameX, frameY,
            width, height 
        ) as Texture       
    }
    getTexture(name: string, direction: string, frameX: number, emotion: string): Texture<Resource> | undefined {
        let frameY:number=0, fx = frameX ? frameX : 0

        let w = this.gameCoordinator.scaledTileSize * this.gameCoordinator.scale    
        return this.flood.am.getTexture(name, frameX, frameY, w, w)
    }
    draw(interp: number): void {
         this.visible = this.display
        const updatedProperties = this.characterUtil!.advanceSpriteSheet(this);
        this.msSinceLastSprite = updatedProperties.msSinceLastSprite;
        this.frame = updatedProperties.frame

        this.setTexture(this.name!, this.direction, updatedProperties.frame, "", this.frameY,this.width, this.height)  
    }
    
}
export default Sonic