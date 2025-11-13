import maze1 from "../mazes/maze-1.js"
import Maze from "../mazes/maze.js"

class MazeManager {    
    constructor() {        
        this.mazes = new Map()
        this.mazes.set("maze1", new Maze(maze1))        
    }
    get(name) {       
        return this.mazes.get(name)
    }
}
export default MazeManager