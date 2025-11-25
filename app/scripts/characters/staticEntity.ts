import { Container, DisplayObject, IHitArea, ObservablePoint, Point, Rectangle, Sprite } from "pixi.js"
import GameCoordinator from "../core/gameCoordinator.ts"
import CharacterUtil from "../utilities/characterUtil.ts"
import EventEmitter from "eventemitter3"
import { createObservablePoint, getAnchorAxis } from "../utilities/utils.ts"

class StaticEntity extends Sprite {
    allowCollision = true
    emitter:EventEmitter
    gameCoordinator:GameCoordinator
    scaledTileSize:number  
    hitArea!: Rectangle | null  
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
        this.anchor.set(0.5) 
    }
   
    registerEventListeners() {   
        
    }
    onReset() {

    }    
    onDeath() {

    }
    reset(){        
        this.createHitArea() 
    }    
    get axis():ObservablePoint<Point> {        
        return getAnchorAxis(this,this.anchor,this.scaledTileSize,this.gameCoordinator.scale)
    }
    update(elapsedMs:number) {
        this.createHitArea() 
    }
    private createHitArea() {
        const ax = this.anchor.x * this.width
        const ay = this.anchor.y * this.height
        const half = this.scaledTileSize * 0.5
        const x = this.x + this.width * 0.5  - half - ax  
        const y = this.y + this.height * 0.5 - half - ay
        this.hitArea =
            new Rectangle(x, y, this.scaledTileSize, this.scaledTileSize)            
    }
    draw(interp:number) {

    }
}
export default StaticEntity