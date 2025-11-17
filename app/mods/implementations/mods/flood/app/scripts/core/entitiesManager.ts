import { Sprite } from "pixi.js";
import Wave from "./wave.js";
import Sonic from "../entities/sonic.js";
import GameCoordinator from "../../../../../../../scripts/core/gameCoordinator.js";
import { getMazeWays } from "../utils/util.js";
import Entity from "../entities/entity.js";

class EntitiesManager {
    wave: Wave;
    entities:Entity[] = []
    gc!:GameCoordinator
    constructor(wave:Wave) {
        this.wave = wave
        this.gc = wave.drownManager.gc 
    }
    tryToGenerateEntity() { 
        const random = Math.random()
        if (random > 0) {
            const ways =  getMazeWays(this.wave.maze)
            const cells = ways.map((f,index)=>{
                const arr = [] as  {row:number, col:number}[]
                f.cols.forEach(col=>{
                    arr.push({row:f.row, col: col})
                })
                return arr 
            }).flat() 
            const index =  Math.floor(Math.random() * (cells.length -1)) 
            const sonic = new Sonic(this.wave.drownManager.flood)
            const coords =  this.wave.maze.getPixelCoordinates(cells[index]!.row,cells[index]!.col)
            sonic.position.set(coords.x, coords.y   )
            this.entities.push(sonic) 
        } 
    }
}
export default EntitiesManager