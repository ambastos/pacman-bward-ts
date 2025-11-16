import { Container, Graphics } from "pixi.js";
import Pacman from "../../../../../../../characters/pacman.js";
import DrownManager from "./drownManager.js";
import GameCoordinator from "../../../../../../../core/gameCoordinator.js";
import Mod from "../mod.js";
import { State } from "../states/state.js";
import Ghost from "../../../../../../../characters/ghost.js";
declare class Flood extends Mod {
    #private;
    width: number;
    maxHeight: number;
    tileSize: number;
    container: Container;
    nextWaveTime: any;
    gp: Graphics;
    drownManager: DrownManager;
    pacman: Pacman;
    ghosts: Ghost[];
    states: State[];
    state: State;
    constructor(gameCoordinator: GameCoordinator);
    initialize(): Promise<void>;
    changeState(state: number): void;
    start(): void;
    stop(): void;
    generateWave(timeToStartMS?: number): void;
    reset(): void;
    update(elapsedMs: number): void;
    draw(): void;
}
export default Flood;
//# sourceMappingURL=flood.d.ts.map