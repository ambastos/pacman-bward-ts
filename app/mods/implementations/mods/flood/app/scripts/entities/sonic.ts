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
import { Mode } from "../../../../../../../scripts/characters/types.ts";
import { Function } from "lodash";

class Sonic extends Ghost {
    flood: Flood;
    animator:Animator
    frameY:number = 0
    bad:boolean = false
    targetDef!:TargetDef
    attackSpeed!:number
    constructor(flood:Flood) {        
        super(flood.gc,"sonic",flood.gc.level, new CharacterUtil())        
        this.name = "sonic"
        this.flood = flood        
        this.scale.set(flood.scale)
        this.setTexture(this.name, this.direction, 1, null, 1, 32, 32) 
        this.animator = new Animator(this);
        this.createAnimations();
    }    
    private createAnimations() {
        this.animator.createAnimation("walk", 200, null, () => {
            if (!this.animate) return;
            const an = this.animator.animations.get("walk");
            this.spriteFrames = 4;
            this.frameY = 0;
            if (this.frame >= this.spriteFrames)
                this.frame = 0;
            this.setTexture(this.name!, this.direction, this.frame, null, this.frameY, 32, 32);
            this.frame++;
        });        
        this.animator.createAnimation("run", 100, null, () => {
            if (!this.animate) return;
            const an = this.animator.animations.get("run");
            this.spriteFrames = 5;
            this.frameY = 0;
            if (this.frame >= this.spriteFrames)
                this.frame = 4;
            this.setTexture(this.name!, this.direction, this.frame, null, this.frameY, 32, 32);
            this.frame++;
        });
        this.animator.createAnimation("target", 200, 1500, () => {
            if (!this.animate) return;
            const an = this.animator.animations.get("target");
            this.spriteFrames = 1;
            this.frameY = 1;
            if (this.frame >= this.spriteFrames)
                this.frame = 0;
            this.setTexture(this.name!, this.direction, this.frame, null, this.frameY, 32, 32);
            this.frame++;
        });
        this.animator.createAnimation("attack", 100, null, () => {
            if (!this.animate) return;
            const an = this.animator.animations.get("attack");
            this.spriteFrames = 7;
            this.frameY = 1;
            if (this.frame >= this.spriteFrames)
                this.frame = 0;
            this.setTexture(this.name!, this.direction, this.frame, null, this.frameY, 32, 32);
            this.frame++;
        });
        this.animator.play("walk");
    }

    setDefaultMode(): void {
        this.allowCollision = true
        this.defaultMode = Mode.idle
        this.mode = Mode.idle        
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
        this.attackSpeed = pacmanSpeed * 1.25

        this.velocityPerMs = this.defaultSpeed;
        this.moving = false;
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
        //targetDef.type = "pacman"
        return targetDef as TargetDef
    }

    setSpriteAnimationStats(): void {
        this.display = true
        this.loopAnimation = true;
        this.animate = true;
        this.msBetweenSprites = 100;
        this.msSinceLastSprite = 0;

        this.frame = 0
        this.frameY = 1
        this.spriteFrames = 1;
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
        if (direction == this.characterUtil.directions.right) {
            if (this.scale.x < 0)
                this.scale.x  = -this.scale.x
        }else if (direction == this.characterUtil.directions.left) {
            if (this.scale.x > 0) 
               this.scale.x = -this.scale.x 
        }
    }
    getTexture(name: string, direction: string, frameX: number, emotion: string): Texture<Resource> | undefined {
        let frameY:number=0, fx = frameX ? frameX : 0

        let w = this.gameCoordinator.scaledTileSize * this.gameCoordinator.scale    
        return this.flood.am.getTexture(name, frameX, frameY, w, w)
    }
    determineVelocity(position: ObservablePoint, mode: Mode) {        
        if (this.paused) {
            return 0;
        }
        if (this.isInTunnel(position) || this.isInGhostHouse(position)) {
            return this.transitionSpeed;
        }
        if (mode === Mode.target) {
            return 0
        }
        if (mode === Mode.attack) {
            return this.attackSpeed;
        }
        return this.defaultSpeed;
    }
    getTarget(name: string, gridPosition: ObservablePoint, pacmanGridPosition: ObservablePoint, 
            mode: string): ObservablePoint<Point> | undefined {
        if (this.targetDef.type == "point") {
            const wayCells = getMazeWays(this.flood.gc.maze!)
            const way = wayCells[ Math.floor(Math.random() * wayCells.length) ]
            const row = way?.row as number
            const col = way?.cols[ Math.floor(Math.random() * way.cols.length) ] as number
            const point = createObservablePoint(this, col, row)
            return this.characterUtil.snapToGrid(point,this.direction,
                this.scaledTileSize, this.anchor, this.gameCoordinator.scale)
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
            this.targetDef.targetEntity = target!
            return target!.getGridPosition()
        }else if (this.targetDef.type ==  "pacman") {
            const pacman = this.flood.gc.pacman
            this.targetDef.targetEntity = pacman
            return pacman.getGridPosition() 
        }
            
        return undefined    
    }   
    update(elapsedMs:number) {
        super.update(elapsedMs)
        if (this.mode == Mode.idle) {
            this.animator.play("walk")
        }else if (this.mode == Mode.chase){
            this.animator.play("run")
        }else if (this.mode == Mode.attack){
            this.animator.play("attack")
        }else if (this.mode == Mode.target) {
            this.animator.play("target")
        }
        this.animator.update()
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
