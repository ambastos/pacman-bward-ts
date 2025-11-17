import { Container, DisplayObject, IHitArea, ObservablePoint, Rectangle, Sprite } from "pixi.js"
import GameCoordinator from "../core/gameCoordinator.js"
import CharacterUtil from "../utilities/characterUtil.js"
import EventEmitter from "eventemitter3"

class Entity extends Sprite {
    allowCollision = true
    emitter:EventEmitter
    gameCoordinator:GameCoordinator
    scaledTileSize:number
    characterUtil?:undefined | CharacterUtil
    defaultPosition = new ObservablePoint(()=>{},0,0);
    oldPosition!:ObservablePoint
    sprite!:Sprite | undefined
    hitArea!:IHitArea | null
    msSinceLastSprite:number=0
    msBetweenSprites:number = 0
    frame:number = 0
    spriteFrames:number = 0
    animate:boolean= false
    measurement:number = 0 
    loopAnimation:boolean = false
    mazeArray:any
    moving!:boolean
    display!:boolean
    level!:number
    direction!:string
    constructor(gameCoordinator: GameCoordinator, name: string, characterUtil?: CharacterUtil) {
        super()
        this.gameCoordinator = gameCoordinator
        this.name = name
        this.scaledTileSize = gameCoordinator.scaledTileSize        
        this.characterUtil = characterUtil
        this.emitter = gameCoordinator.emitter
    }
    getGridPosition():ObservablePoint | undefined {
        return this.characterUtil?.determineGridPosition(
            this.position, this.scaledTileSize)
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
        if (this.sprite) {
            const half = this.scaledTileSize * 0.5
            const x = this.sprite.x + this.sprite.width * 0.5 - half
            const y = this.sprite.y + this.sprite.height * 0.5 - half  
            this.sprite.hitArea = 
                new Rectangle(x, y, this.scaledTileSize, this.scaledTileSize) 
            this.hitArea = this.sprite.hitArea
        }
    }
    draw(interp:number) {

    }
}
export default Entity