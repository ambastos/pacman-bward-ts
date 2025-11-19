import { Rectangle } from "pixi.js"
import Maze from "../../../../../../../scripts/mazes/maze.ts"
/**
 * 
 * @param {Rectangle} rectangle 
 * @param {Number} times 
 */
function enlarge(rectangle:Rectangle, times:number=1):Rectangle {
    rectangle.x = rectangle.x * times
    rectangle.y = rectangle.y * times
    rectangle.width = rectangle.width * times
    rectangle.height = rectangle.height * times
    return rectangle 
}

function getMazeWays (maze:Maze):{row:number, cols:number[]} [] {
    return maze.mazeArray.map((f: string[],i: number, a: string[][])=>{ 
        let rr = f.map((g: string,j: number)=>{   
            if  (g == 'o')  
                return j
            else  
                return -1
        })  
        return {"row": i, "cols":rr.filter((f: number)=>f>-1)}
    }).filter((f: { cols: number[] },i: number)=>{  
        return f.cols.length > 0
    }) 
}
export {enlarge, getMazeWays}