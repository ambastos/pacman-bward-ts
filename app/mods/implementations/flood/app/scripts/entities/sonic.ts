import { ObservablePoint, Point, Resource, Sprite, Texture } from "pixi.js";
import Flood from "../core/flood.ts";
import Animator from "../animations/animator.ts";
import Ghost from "../../../../../../scripts/characters/ghost.ts";
import CharacterUtil from "../../../../../../scripts/utilities/characterUtil.ts";
import Pacman from "../../../../../../scripts/characters/pacman.ts";
import { calculateDistancePos, createObservablePoint, vLerp } from "../../../../../../scripts/utilities/utils.ts";
import Timer from "../../../../../../scripts/utilities/timer.ts";
import MovableEntity from "../../../../../../scripts/characters/movableEntity.ts";
import { Mode } from "../../../../../../scripts/characters/types.ts";
import { sound } from "@pixi/sound";

class Sonic extends Ghost {
    flood: Flood;
    animator:Animator
    frameY:number = 0
    bad:boolean = false
    seenTarget = false
    leaving = false
    leavingPending = false
    goOutTimer:number | null = null
    targetDef!:TargetDef
    attackSpeed!:number
    activeTimers:Timer[]=[]
    constructor(flood:Flood) {        
        super(flood.gc,"sonic",flood.gc.level, new CharacterUtil())        
        this.name = "sonic"
        this.flood = flood        
        this.scale.set(flood.scale)
        this.setTexture(this.name, this.direction, 1, null, 1, 32, 32) 
        this.animator = new Animator(this);
        this.createAnimations();
        this.registerEventListeners()        
    }    
    
    private createAnimations() {
        this.animator.createAnimation("walk", 200, null, () => {
            if (!this.animate) return;
            const an = this.animator.animations.get("walk");
            this.msBetweenSprites = 200
            this.spriteFrames = 4;
            this.frameY = 0;
            if (this.frame >= this.spriteFrames)
                this.frame = 0;
            //this.setTexture(this.name!, this.direction, this.frame, null, this.frameY, 32, 32);
            this.frame++;
        });        
        this.animator.createAnimation("run", 100, null, () => {
            if (!this.animate) return;
            const an = this.animator.animations.get("run");
            this.msBetweenSprites = 100
            this.spriteFrames = 5;
            this.frameY = 0;
            if (this.frame >= this.spriteFrames-1)
                this.frame = 4;
            //this.setTexture(this.name!, this.direction, this.frame, null, this.frameY, 32, 32);
            this.frame++;
        });
        this.animator.createAnimation("target", 200, 1500, () => {
            if (!this.animate) return;
            const an = this.animator.animations.get("target");
            this.allowCollision = false
            this.msBetweenSprites = 200
            this.spriteFrames = 1;
            this.frameY = 1;
            if (this.frame >= this.spriteFrames-1)
                this.frame = 0;
            //this.setTexture(this.name!, this.direction, this.frame, null, this.frameY, 32, 32);
            this.frame++;
        }).onEnd((args:any)=>{ 
            this.allowCollision = true
            this.mode = Mode.attack
        })
        this.animator.createAnimation("attack", 100, null, () => {
            if (!this.animate) return;
            const an = this.animator.animations.get("attack");
            this.msBetweenSprites = 100
            if ( Date.now() - an?.startTime! < 500) {
                this.frameY = 1;
                this.spriteFrames = 7;
                if (this.frame >= this.spriteFrames-1)
                    this.frame = 0;
            }else {
                this.spriteFrames = 9
                if (this.frame >= this.spriteFrames-1) {
                    this.frame = 0
                    this.frameY = this.frameY == 1 ? 2 : 1
                    if (this.frameY == 1)
                        this.frame = 7
                }
            }            
            //this.setTexture(this.name!, this.direction, this.frame, null, this.frameY, 32, 32);
            this.frame++;
        });
        this.animator.createAnimation("sonic-enter", 100, null, () => {
            if (!this.animate) return;
            const an = this.animator.animations.get("sonic-enter");
            const direction = an?.args[0]?.direction
            const destPos = an?.args[0]?.destPos
            if (!destPos) return
            const curPos = vLerp(this.position, destPos, 0.1)

            this.moving = false
            this.allowCollision = false
            this.msBetweenSprites = 100
            this.spriteFrames = 5;  
            this.frameY = 1;                 
            if (this.frame >= this.spriteFrames)
                this.frame = 1;
            this.frame++;
            this.position.set(curPos.x, curPos.y)
            if (calculateDistancePos(this.position, destPos) < 2) {
                //Round-trip using the same conversion the movement system uses so the
                //sonic lands exactly on a snapped grid position
                const gridPos = this.characterUtil.determineGridPosition(
                    destPos, this.scaledTileSize, this.anchor, this.gameCoordinator.scale
                )
                const pos = this.characterUtil.snapToGrid(
                    gridPos, direction, this.scaledTileSize,
                    this.anchor, this.gameCoordinator.scale
                )
                this.direction = direction
                this.position.set(pos.x, pos.y)
                an?.stop()
            }
        }).onStart(()=>{
            //Anchors the entrance to a path cell on the maze border so the roll-in
            //never crosses through walls
            const maze = this.flood.gc.maze!
            const ways = maze.getWays()
            const cells: {row:number, col:number}[] = []
            ways.forEach(f=>f.cols.forEach(col=>cells.push({row:f.row, col: col})))
            const borderCells = cells.filter(c =>
                c.row <= 1 || c.row >= maze.rows - 2
                    || c.col <= 1 || c.col >= maze.cols - 2)
            const pool = borderCells.length > 0 ? borderCells : cells
            const entry = pool[Math.floor(Math.random() * pool.length)]!
            const entryPixel = this.characterUtil.snapToGrid(
                createObservablePoint(this, entry.col, entry.row),
                this.characterUtil.directions.right, this.scaledTileSize,
                this.anchor, this.gameCoordinator.scale
            )
            let direction = this.characterUtil.directions.down
            const outside = { x: entryPixel.x, y: entryPixel.y }
            if (entry.row <= 1) {
                direction = this.characterUtil.directions.down
                outside.y = entryPixel.y - this.scaledTileSize
            } else if (entry.row >= maze.rows - 2) {
                direction = this.characterUtil.directions.up
                outside.y = entryPixel.y + this.scaledTileSize
            } else if (entry.col <= 1) {
                direction = this.characterUtil.directions.right
                outside.x = entryPixel.x - this.scaledTileSize
            } else {
                direction = this.characterUtil.directions.left
                outside.x = entryPixel.x + this.scaledTileSize
            }

            const an = this.animator.animations.get("sonic-enter")
            an?.args.push({
                direction: direction,
                destPos: {x: entryPixel.x, y: entryPixel.y}
            })
            this.direction = direction
            this.moving = false
            this.position.set(outside.x, outside.y)
        }).onEnd(()=>{
            this.moving = true
            this.allowCollision = true
            this.mode = Mode.idle
            this.scheduleGoOut()
        })
        this.animator.createAnimation("sonic-out", 100,null, ()=>{
            if (!this.leaving) return;
            const an = this.animator.animations.get("sonic-out")
            const destPos = an?.args[0]?.destPos
            if (!destPos) return
            const curPos =  vLerp(this.position, destPos, 0.15)
            this.moving = false
            this.allowCollision = false
            this.msBetweenSprites = 80
            this.spriteFrames = 5;
            this.frameY = 1;
            if (this.frame >= this.spriteFrames)
                this.frame = 1;
            //this.setTexture(this.name!, this.direction, this.frame, null, this.frameY, 32, 32);
            this.frame++;
            this.position.set(curPos.x, curPos.y)
            if (calculateDistancePos(this.position, destPos) < 2) {
                an?.stop()
            }
        }).onStart(()=>{
            const exit = this.calculateExitPoint()
            this.direction = exit.direction
            const an = this.animator.animations.get("sonic-out")
            an?.args.push({ destPos: {x: exit.x, y: exit.y} } as any)
        }).onEnd(()=>{
            this.flood.wavesManager.entitiesManager.removeSonic(this)
        })
        this.animator.createAnimation("ghost-kick", 40, null,
            (args) => {
                //console.log("ghost-kick animation   ", args.direction, args.ghost);    
                this.mode = Mode.idle            
                const ghost = args.ghost as Ghost    
                ghost.allowCollision = false
                
                const velocity = ghost.fastSpeed * 1.5 * 30
                const bounds = this.gameCoordinator.maze?.bounds
                const gridPos = ghost.getGridPosition()
                let collides = false
                let pos, newGridPos = createObservablePoint(this,gridPos.x, gridPos.y)
                let newDirection = this.direction
                switch (args.direction) {
                    case "left":
                        ghost.skew.set(Math.PI*0.5,Math.PI*0.5)                        
                        collides = bounds?.left.some((e:any)=>
                            e.x == Math.floor(gridPos.x) && e.y == Math.floor(gridPos.y))!
                        if (collides) {
                            newGridPos.set(gridPos.x, gridPos.y)
                            newDirection = ghost.characterUtil.getOppositeDirection("left")
                            //ghost.x = (gridPos.x+0.5) * this.scaledTileSize
                             
                            //ghost.y = (gridPos.y + 0.5) * this.scaledTileSize
                        }else    
                            ghost.x -= velocity
                        break;
                    case "right":
                        ghost.skew.set(-Math.PI*0.5,Math.PI * 0.5)
                        collides = bounds?.right.some((e:any)=>
                            e.x == Math.floor(gridPos.x) && e.y == Math.ceil(gridPos.y))!
                        if (collides) {
                            //ghost.x = (gridPos.x - 0.5) * this.scaledTileSize
                            newGridPos.set(gridPos.x-0.5, gridPos.y)
                            newDirection = ghost.characterUtil.getOppositeDirection("right")                               
                        }else    
                            ghost.x += velocity     
                        break;    
                    case "up":
                        ghost.skew.set(0,0)
                        collides = bounds?.top.some((e:any)=>e.y == Math.floor(gridPos.y))!
                        if (collides) {
                            //ghost.y = (gridPos.y + 0.5) * this.scaledTileSize
                            newGridPos.set(gridPos.x, gridPos.y)
                            newDirection = ghost.characterUtil.getOppositeDirection("up")  
                        }else    
                            ghost.y -= velocity     
                        break;
                    case "down":
                        ghost.skew.set(Math.PI, Math.PI)
                        collides = bounds?.bottom.some((e:any)=>e.y == Math.ceil(gridPos.y))!
                        if (collides) {
                            //ghost.y = (gridPos.y-0.5) * this.scaledTileSize
                            newGridPos.set(gridPos.x, gridPos.y)
                            newDirection = ghost.characterUtil.getOppositeDirection("down")
                        }else    
                            ghost.y += velocity     
                        break;  
                    }
                    if (collides) { 
                        pos = ghost.characterUtil.snapToGrid(newGridPos, newDirection,
                            ghost.scaledTileSize,ghost.anchor, ghost.gameCoordinator.scale)
                        ghost.position.set(pos.x, pos.y)    
                        sound.play("sonic_break")

                        const an = this.animator.animations.get("ghost-kick")
                        an?.pause()
                        ghost.mode = Mode.scared
                        ghost.scaredColor = "white" 
                        //make sonic walk again
                        this.activeTimers.push(
                            new Timer(()=>{
                                this.animator.play("walk");
                                this.scheduleGoOut()
                            }, 500) 
                        )
                        //make ghost came back again
                        const nextTimeGhostRespawn = Math.max(6, Math.random() * 10)* 1000
                        this.activeTimers.push(
                            new Timer(()=>{                            
                                ghost.skew.set(0,0)
                                ghost.mode = Mode.eyes
                                ghost.moving = true
                                ghost.allowCollision = true
                                ghost.animate = true
                            }, nextTimeGhostRespawn)                       
                        )
                    }
            }
        );
    }
    reset(fullGameReset?: boolean): void {
        super.reset()
        this.setTarget(null)
        this.leaving = false
        this.leavingPending = false
        if (this.goOutTimer) {
            window.clearTimeout(this.goOutTimer)
            this.goOutTimer = null
        }
    }
    registerEventListeners(): void {
        super.registerEventListeners()
        this.emitter.on("ghost-kick", this.onGhostKick.bind(this))
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
            this.tint =  0xcc0022
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
        if (this.targetDef.targetReached) return       
        //debug        
        if (this.targetDef.type == "point") {
            const wayCells = this.flood.gc.maze!.getWays()
            const way = wayCells[ Math.floor(Math.random() * wayCells.length) ]
            const row = way?.row as number
            const col = way?.cols[ Math.floor(Math.random() * way.cols.length) ] as number
            return createObservablePoint(this, col, row)
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

            this.target = target!
            return target!.getGridPosition()
        }else if (this.targetDef.type ==  "pacman") {
            const pacman = this.flood.gc.pacman
            this.target = pacman
            return pacman.getGridPosition() 
        }
            
        return undefined    
    }  
    scheduleGoOut() {
        if (this.goOutTimer) {
            window.clearTimeout(this.goOutTimer)
            this.goOutTimer = null
        }
        const delay = 5000 + Math.random() * 15000
        this.goOutTimer = window.setTimeout(() => {
            this.goOutTimer = null
            this.beginGoOut()
        }, delay)
    }
    beginGoOut() {
        if (this.leaving) return
        if (this.mode !== Mode.idle) {
            this.leavingPending = true
            return
        }
        this.leaving = true
        this.moving = false
        this.allowCollision = false
    }
    private calculateExitPoint(): {x:number, y:number, direction:string} {
        //Sonic runs to the border that matches the direction he's currently heading
        const maze = this.flood.gc.maze!
        const rightEdge = maze.cols * this.scaledTileSize
        const bottomEdge = maze.rows * this.scaledTileSize
        const pos = this.position
        switch (this.direction) {
            case this.characterUtil.directions.left:
                return { direction: 'left', x: -this.scaledTileSize * 2, y: pos.y }
            case this.characterUtil.directions.right:
                return { direction: 'right', x: rightEdge + this.scaledTileSize * 2, y: pos.y }
            case this.characterUtil.directions.up:
                return { direction: 'up', x: pos.x, y: -this.scaledTileSize * 2 }
            default:
                return { direction: 'down', x: pos.x, y: bottomEdge + this.scaledTileSize * 2 }
        }
    }
    private handleAnimations() {
        if (this.leaving) {
            if (!this.animator.isPlaying("sonic-out"))
                this.animator.play("sonic-out")
        } else if (!this.targetDef.targetReached) {
            if (this.mode == Mode.entering) {
                if (!this.animator.isPlaying("sonic-enter"))
                    this.animator.play("sonic-enter");
            }else if (this.mode == Mode.idle) {
                if (!this.animator.isPlaying("walk"))
                    this.animator.play("walk");
            } else if (this.mode == Mode.chase) {
                if (!this.animator.isPlaying("run"))
                    this.animator.play("run");
            } else if (this.mode == Mode.attack) {
                if (!this.animator.isPlaying("attack"))
                    this.animator.play("attack");
            } else if (this.mode == Mode.target) {
                if (!this.animator.isPlaying("target"))
                    this.animator.play("target");
            }
        }
        if (this.leavingPending && this.mode === Mode.idle && !this.leaving)
            this.beginGoOut()
        this.animator.update();
    }
    checkCollision(position: ObservablePoint, target: MovableEntity): void {
        if (!target || !target.allowCollision) return
        if (this.calculateDistance(position, target.getGridPosition()) < 1
            && this.allowCollision) {
            if (target instanceof Ghost && target.mode != Mode.eyes) 
                this.emitter.emit(`ghost-kick`,target)
            else if (target instanceof Pacman)
                this.emitter.emit('pacman-death')
        }
    }
    private onGhostKick(ghost:Ghost) {
        ghost.moving = false
        ghost.allowCollision = false  
        ghost.animate = false
        this.targetDef.targetReached = true  
        this.target = null    
        sound.play("sonic_impact")
        this.animator.play("ghost-kick", {direction: this.direction, ghost:ghost})
    }
    update(elapsedMs:number) {
        super.update(elapsedMs)  
        this.handleAnimations();
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
    targetReached?:boolean         
}
