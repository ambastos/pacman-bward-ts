import { Sprite } from "pixi.js";
import Wave from "./wave.ts";
import Sonic from "../entities/sonic.ts";
import GameCoordinator from "../../../../../../../scripts/core/gameCoordinator.ts";
import { getMazeWays } from "../utils/util.ts";
import Entity from "../entities/entity.ts";

class EntitiesManager {
    wave: Wave;
    entities:Entity[] = []
    gc!:GameCoordinator
    constructor(wave:Wave) {
        this.wave = wave
        this.gc = wave.waveManager.gc 
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
            const sonic = new Sonic(this.wave.waveManager.flood)
            this.wave.waveManager.createBreath(sonic)
            const coords =  this.wave.maze.getPixelCoordinates(cells[index]!.row,cells[index]!.col)
            sonic.position.set(coords.x, coords.y   )
            this.wave.queueElement("entity", sonic)
        } 
    }
}
export default EntitiesManager