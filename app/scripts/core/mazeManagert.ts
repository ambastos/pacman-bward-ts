import maze1 from "../mazes/maze-1.js"
import Maze from "../mazes/maze.js"

class MazeManager {
    mazes: Map<String, Maze>    
    constructor() {        
        this.mazes = new Map()
        this.mazes.set("maze1", new Maze(maze1))        
    }
    get(name: string | String) {       
        return this.mazes.get(name)
    }
}
export default MazeManager