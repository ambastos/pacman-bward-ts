import maze1 from "../mazes/maze-1.js"

class MazeManager {    
    constructor() {
        this.mazes = new Map()
        this.mazes.set("maze1", maze1)
    }
    get(name) {
        const mazeArray = this.mazes.get(name)
        if (!mazeArray) return null
        mazeArray.forEach((row, rowIndex)=>{
            mazeArray[rowIndex] = row[0].split("")
        })
        return mazeArray
    }
}
export default MazeManager