import { Sprite } from "pixi.js";
import Maze from "../../../../../../../mazes/maze.js";
import DrownManager from "./drownManager.js";
declare class Wave extends Sprite {
    speedY: number;
    startTime: number;
    started: boolean;
    decreasing: boolean;
    lastTime: number;
    maze: Maze;
    drownManager: DrownManager;
    gp: any;
    container: any;
    startTopY: number;
    bublesLocation: any[];
    duration: number;
    constructor(drownManager: DrownManager, maze: Maze, width: number, height: number);
    increase(elapsedMs: number): void;
    decrease(elapsedMs: number): void;
    updatePosition(): void;
    get isDescreasing(): boolean;
    cancel(): void;
    show(): void;
    draw(): void;
}
export default Wave;
//# sourceMappingURL=wave.d.ts.map