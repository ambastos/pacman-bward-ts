import Maze from "../mazes/maze.js";
declare class MazeManager {
    mazes: Map<String, Maze>;
    constructor();
    get(name: string | String): Maze | undefined;
}
export default MazeManager;
//# sourceMappingURL=mazeManagert.d.ts.map