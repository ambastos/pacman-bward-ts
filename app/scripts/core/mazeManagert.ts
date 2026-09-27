import maze1 from "../mazes/maze-1.ts"
import Maze from "../mazes/maze.ts"

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