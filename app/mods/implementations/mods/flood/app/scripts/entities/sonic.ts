import { ObservablePoint, Point, Resource, Sprite, Texture } from "pixi.js";
import Flood from "../core/flood.ts";
import Wave from "../core/wave.ts";
import Animator from "../animations/animator.ts";
import Ghost from "../../../../../../../scripts/characters/ghost.ts";
import CharacterUtil from "../../../../../../../scripts/utilities/characterUtil.ts";
import Pacman from "../../../../../../../scripts/characters/pacman.ts";
import { createObservablePoint } from "../../../../../../../scripts/utilities/utils.ts";
import Timer from "../../../../../../../scripts/utilities/timer.ts";
import MovableEntity from "../../../../../../../scripts/characters/movableEntity.ts";
import { getMazeWays } from "../utils/util.ts";

class Sonic extends Ghost {
    flood: Flood;
    animator:Animator
    frameY:number = 0
    bad:boolean = false
    targetDef!:TargetDef
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
        this.allowCollision = true
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
        this.moving = true;
        //Logic to try to move Sonic based on his temper
        
        this.bad =  Math.random() > 0.7
        if (this.bad)
            this.tint =  0xff0022
        this.targetDef = this.generateTargetType();           

        this.defaultDirection = this.characterUtil!.directions.left;
        this.direction = this.defaultDirection
    }
    private generateTargetType():TargetDef {
        const randomTargetType = Math.random();
        let targetDef: Partial<TargetDef> = {
            nextTargetTime: Date.now() + (Math.random() * 40 * 1000)
        };

        if (randomTargetType >= 0 && randomTargetType <= 0.5)
            targetDef.type = "point";
        else {
            if (this.bad) {
                if (randomTargetType > 0.5 && randomTargetType <= 0.8)
                    targetDef.type = "ghost";

                else
                    targetDef.type = "pacman";
            } else {
                targetDef.type = "ghost";
            }
        }
        //for debug
        targetDef.type = "pacman"
        return targetDef as TargetDef
    }

    setSpriteAnimationStats(): void {
        this.display = true
        this.loopAnimation = true;
        this.animate = true;
        this.msBetweenSprites = 100;
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
    getTarget(name: string, gridPosition: ObservablePoint, pacmanGridPosition: ObservablePoint, 
            mode: string): ObservablePoint<Point> | undefined {
        if (this.targetDef.type == "point") {
            const wayCells = getMazeWays(this.flood.gc.maze!)
            const way = wayCells[ Math.floor(Math.random() * wayCells.length) ]
            const row = way?.row as number
            const col = way?.cols[ Math.floor(Math.random() * way.cols.length) ] as number
            const point = createObservablePoint(this, col, row)
            return this.characterUtil.snapToGrid(point,this.direction,this.scaledTileSize)
        }else if (this.targetDef.type == "ghost") {             
            const ghosts = this.flood.gc.ghosts
            let bestDistance = Infinity
            let target:Ghost
            ghosts.forEach((g)=>{
                const distance = this.calculateDistance(this.position, g.position)
                if (distance < bestDistance) {
                    target = g
                    bestDistance = distance
                }
            })
            return target!.getGridPosition()
        }else if (this.targetDef.type ==  "pacman") {
            const pacman = this.flood.gc.pacman
            return pacman.getGridPosition() 
        }
            
        return undefined    
    }
    update(elapsedMs:number) {
        super.update(elapsedMs)
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

type TargetDef = {
    type: "point" | "pacman" | "ghost"
    nextTargetTime:number
    targetPoint?:ObservablePoint | undefined
    targetEntity?:MovableEntity | undefined
    targetReached?:boolean     
}