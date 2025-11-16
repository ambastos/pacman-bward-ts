"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const maze_1_js_1 = __importDefault(require("../mazes/maze-1.js"));
const maze_js_1 = __importDefault(require("../mazes/maze.js"));
class MazeManager {
    mazes;
    constructor() {
        this.mazes = new Map();
        this.mazes.set("maze1", new maze_js_1.default(maze_1_js_1.default));
    }
    get(name) {
        return this.mazes.get(name);
    }
}
exports.default = MazeManager;