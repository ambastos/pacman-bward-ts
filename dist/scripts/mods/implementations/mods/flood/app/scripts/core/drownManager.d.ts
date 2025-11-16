import { Graphics } from "pixi.js";
import Ghost from "../../../../../../../characters/ghost.js";
import Pacman from "../../../../../../../characters/pacman.js";
import GameCoordinator from "../../../../../../../core/gameCoordinator.js";
import Animator from "../animations/animator.js";
import Flood from "./flood.js";
import Wave from "./wave.js";
import EventEmitter from "eventemitter3";
declare class DrownManager {
    #private;
    wave: Wave | null;
    waveTime: any;
    nextWaveTime: any;
    maxHeight: number;
    gc: GameCoordinator;
    animator: Animator;
    flood: Flood;
    gp: Graphics;
    pacman: Pacman;
    ghosts: Ghost[];
    emitter: EventEmitter;
    constructor(flood: Flood);
    initialize(): void;
    private createBreath;
    resetEntitiesBreathing(): void;
    private resetEntity;
    stopDrown(entity: any): void;
    tryDrownEntities(elapsedMs: number): void;
    killEntity(entity: any): void;
    showBreathingStatus(entity: Pacman): void;
    clear(): void;
    stop(): void;
    update(elapsedMs: number): void;
}
export default DrownManager;
//# sourceMappingURL=drownManager.d.ts.map