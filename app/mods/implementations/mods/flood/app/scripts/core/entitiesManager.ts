import { Sprite } from "pixi.js";
import Wave from "./wave.ts";
import Sonic from "../entities/sonic.ts";
import GameCoordinator from "../../../../../../../scripts/core/gameCoordinator.ts";
import { getMazeWays } from "../utils/util.ts";
import Entity from "../entities/entity.ts";
import { ObjectsGroup } from "../types/types.ts";
import { createObservablePoint } from "../../../../../../../scripts/utilities/utils.ts";

class EntitiesManager {
    gc!:GameCoordinator
    constructor(gc:GameCoordinator) {
        this.gc = gc
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
            if (this.gc.stage.children.filter(e=>e instanceof Sonic).length > 4)
                return 
            const sonic = new Sonic(wave.wavesManager.flood)
            wave.wavesManager.createBreath(sonic)
            const position = sonic.characterUtil.snapToGrid(
                createObservablePoint(this,cells[index]!.col, cells[index]!.row),
                sonic.characterUtil.directions.left,                
                sonic.scaledTileSize 
            )
            //const coords =  this.wave.maze.getPixelCoordinates(cells[index]!.row,cells[index]!.col)
            sonic.reset()
            sonic.position.set(position.x, position.y)
            wave.queueElement("entity", sonic)
        } 
    }
    update(elapsedMs:number) {
    
    }
}
export default EntitiesManager