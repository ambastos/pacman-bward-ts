import { Container, DisplayObject, IHitArea, ObservablePoint, Point, Rectangle, Sprite } from "pixi.js"
import GameCoordinator from "../core/gameCoordinator.ts"
import CharacterUtil from "../utilities/characterUtil.ts"
import EventEmitter from "eventemitter3"
import { createObservablePoint } from "../utilities/utils.ts"

class StaticEntity extends Sprite {
    allowCollision = true
    emitter:EventEmitter
    gameCoordinator:GameCoordinator
    scaledTileSize:number
    hitArea!:IHitArea | null
    msSinceLastSprite:number=0
    msBetweenSprites:number = 0
    frame:number = 0
    spriteFrames:number = 0
    animate:boolean= false
    measurement:number = 0 
    loopAnimation:boolean = false
    mazeArray:any
    display!:boolean    
    constructor(gameCoordinator: GameCoordinator, name: string) {
        super()
        this.gameCoordinator = gameCoordinator
        this.name = name
        this.scaledTileSize = gameCoordinator.scaledTileSize                
        this.emitter = gameCoordinator.emitter
    }
   
    registerEventListeners() {   
        
    }
    onReset() {

    }    
    onDeath() {

    }
    reset(){

    }    
    update(elapsedMs:number) {
        const half = this.scaledTileSize * 0.5
        const x = this.x + this.width * 0.5 - half
        const y = this.y + this.height * 0.5 - half  
        this.hitArea = 
            new Rectangle(x, y, this.scaledTileSize, this.scaledTileSize) 
    }
    draw(interp:number) {

    }
}
export default StaticEntity