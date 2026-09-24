import { Container, Sprite } from "pixi.js";
import Wave from "./wave.ts";
import Sonic from "../entities/sonic.ts";
import GameCoordinator from "../../../../../../scripts/core/gameCoordinator.ts";
import MovableEntity from "../../../../../../scripts/characters/movableEntity.ts";
import { Mode } from "../../../../../../scripts/characters/types.ts";
import { createObservablePoint } from "../../../../../../scripts/utilities/utils.ts";


class EntitiesManager {
    gc!:GameCoordinator
    queuedList:EntityDefs[] = []
    entitiesDef:EntityDefs[] = []
    container:Container
    constructor(gc:GameCoordinator) {
        this.gc = gc
        this.container = gc.stage        
        this.gc.emitter.on("flood-end",()=>{
            this.clearEntities()
        })
    }      
    restart() {
        this.entitiesDef.forEach(def=>{
            const e = def.entity
            e.moving = true
            e.display = true
            e.animate = true
            e.allowCollision = true
        }) 
    }
    tryToGenerateEntities(wave:Wave | null) { 
        //Always just one sonic per wave
        if (this.queuedList.length > 0 || this.entitiesDef.length > 0) return
        if (wave) {
            const ways =  wave.maze.getWays()
            const cells = ways.map((f,index)=>{
                const arr = [] as  {row:number, col:number}[]
                f.cols.forEach(col=>{
                    arr.push({row:f.row, col: col})
                })
                return arr 
            }).flat()
            const index =  Math.floor(Math.random() * (cells.length -1)) 
            if (this.gc.stage.children.filter(e=>e instanceof Sonic).length > 0)
                return 
            const sonic = new Sonic(wave.wavesManager.flood)
            wave.wavesManager.createBreath(sonic)
            const position = sonic.characterUtil.snapToGrid(
                createObservablePoint(this,cells[index]!.col, cells[index]!.row),
                sonic.characterUtil.directions.left, sonic.scaledTileSize,
                sonic.anchor, this.gc.scale 
            )
            sonic.reset()
            sonic.position.set(position.x, position.y)
            const defs = { 
                entity: sonic,
                startAppearsInMs: 5000//Change to random in ms
                
            } as EntityDefs
            this.queueEntity(defs)
            //wave.queueElement("entity", sonic)
        } 
    }
    makeSonicLeave() {
        this.entitiesDef.forEach(def => {
            const e = def.entity
            if (e instanceof Sonic)
                e.beginGoOut()
        })
    }
    removeSonic(entity:Sonic) {
        const idx = this.entitiesDef.findIndex(d => d.entity == entity)
        if (idx > -1)
            this.entitiesDef.splice(idx, 1)
        if (entity.parent)
            this.container.removeChild(entity)
    }
    dequeAllEntities() {
        const entities = this.dequeEntitiesBy()                       
        entities.forEach((def)=>{
            const e = def.entity
            e.name = "sonic"
            e.moving = true
            e.animate = true
            this.addEntityDef(def)            
        })
    }
    queueEntity(entity:EntityDefs) {
        this.queuedList.push(entity)
    }
    dequeEntitiesBy(name?:string):EntityDefs[] {
        const entities = this.queuedList.filter(f=>f.entity.name != name)
        const indexes = entities
            .map((e)=>this.queuedList.indexOf(e))
        for (let i = this.queuedList.length-1; i >=0; i--) {
            if (indexes.lastIndexOf(i) > -1)            
                this.queuedList.splice(i,1)
        }   
        return entities
    }
    addEntityDef(entityDef:EntityDefs) {
        //Includes enter animation        
        entityDef.timeAdded = Date.now()
        this.entitiesDef.push(entityDef)
        
        //The programmed start is in update() method        
    }
    clearEntities() {        
        this.entitiesDef.forEach(def=>{
            const e = def.entity
            this.container.removeChild(e)
        })
        this.entitiesDef.length = 0
        this.queuedList.length = 0
    }
    hide() {
        this.entitiesDef.forEach(def=>{
            const e = def.entity
            e.display = false            
        }) 
    }
    stop() {
        this.clearEntities()        
    }
    update(elapsedMs:number) {
        const curTime = Date.now()
        for (let i=0;i<this.entitiesDef.length; i++ ){
            const def = this.entitiesDef[i]
            const entity = def!.entity
            if (entity.parent == this.container) continue

            if (curTime - def!.timeAdded! >= def!.startAppearsInMs) {
                //Create an enter animation
                if (entity instanceof Sonic) {
                    entity.mode = Mode.entering
                    this.container.addChild(entity)
                }
                
            }
        }
    }
}
export default EntitiesManager

type EntityDefs = {
    entity: MovableEntity,
    timeAdded?: number, 
    startAppearsInMs: number
}