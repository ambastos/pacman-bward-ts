import { Container, Sprite } from "pixi.js";
import Wave from "./wave.ts";
import Sonic from "../entities/sonic.ts";
import GameCoordinator from "../../../../../../../scripts/core/gameCoordinator.ts";
import { getMazeWays } from "../utils/util.ts";
import { ObjectsGroup } from "../types/types.ts";
import { createObservablePoint } from "../../../../../../../scripts/utilities/utils.ts";
import MovableEntity from "../../../../../../../scripts/characters/movableEntity.ts";

class EntitiesManager {
    gc!:GameCoordinator
    queuedList:MovableEntity[] = []
    entities:MovableEntity[] = []
    container:Container
    constructor(gc:GameCoordinator) {
        this.gc = gc
        this.container = gc.stage
    }      
    restart() {
        this.entities.forEach(e=>{
            e.moving = true
            e.display = true
            e.allowCollision = true
        }) 
    }
    tryToGenerateEntities(wave:Wave | null) { 
        const random = Math.random()
        if (wave && random > 0) {
            const ways =  getMazeWays(wave.maze)
            const cells = ways.map((f,index)=>{
                const arr = [] as  {row:number, col:number}[]
                f.cols.forEach(col=>{
                    arr.push({row:f.row, col: col})
                })
                return arr 
            }).flat()
            const index =  Math.floor(Math.random() * (cells.length -1)) 
            //TODO only for debuggin, Just adding one sonic
            if (this.gc.stage.children.filter(e=>e instanceof Sonic).length > 0)
                return 
            const sonic = new Sonic(wave.wavesManager.flood)
            wave.wavesManager.createBreath(sonic)
            const position = sonic.characterUtil.snapToGrid(
                createObservablePoint(this,cells[index]!.col, cells[index]!.row),
                sonic.characterUtil.directions.left, sonic.scaledTileSize,
                sonic.anchor, this.gc.scale 
            )
            //const coords =  this.wave.maze.getPixelCoordinates(cells[index]!.row,cells[index]!.col)
            sonic.reset()
            sonic.position.set(position.x, position.y)
            this.queueEntity(sonic)
            //wave.queueElement("entity", sonic)
        } 
    }
    dequeAllEntities() {
        const entities = this.dequeEntitiesBy()                       
        entities.forEach((e)=>{
            e.name = "sonic"
            e.moving = true
            this.addEntity(e)            
        })
    }
    queueEntity(entity:MovableEntity) {
        this.queuedList.push(entity)
    }
    dequeEntitiesBy(name?:string):MovableEntity[] {
        const entities = this.queuedList.filter(f=>f.name != name)
        const indexes = entities
            .map((e)=>this.queuedList.indexOf(e))
        for (let i = this.queuedList.length-1; i >=0; i--) {
            if (indexes.lastIndexOf(i) > -1)            
                this.queuedList.splice(i,1)
        }   
        return entities
    }
    addEntity(entity:MovableEntity) {
        this.entities.push(entity)
        this.container.addChild(entity)
    }
    clearEntities(name?:string) {
        this.entities = this.entities.filter(e=>e.name != name)
        this.entities.forEach(e=>{
            this.container.removeChild(e)
        })
    }
    hide() {
        this.entities.forEach(e=>{
            e.display = false            
        })
    }
    stop() {
        //clear all entities
        this.entities.forEach(e=>{
            e.moving = false            
        })
    }
    update(elapsedMs:number) {
    
    }
}
export default EntitiesManager