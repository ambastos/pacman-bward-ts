import Maze from "../mazes/maze.ts";
declare class MazeManager {
    mazes: Map<String, Maze>;
    constructor();
    get(name: string | String): Maze | undefined;
}
export default MazeManager;
//# sourceMappingURL=mazeManagert.d.ts.map