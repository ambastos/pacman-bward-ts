import EventEmitter from "eventemitter3";
import GameCoordinator from "../core/gameCoordinator.js";
/**
 * Module class to pacmam-bward game
 */
declare class Mod {
    emitter: EventEmitter;
    started: boolean;
    paused: boolean;
    initialized: boolean;
    scale: number;
    gc: GameCoordinator;
    constructor(gameCoordinator: GameCoordinator);
    initialize(): void;
    reset(): void;
    start(): void;
    stop(): void;
    pause(): void;
    unPause(): void;
    update(elapsedMs: number): void;
    draw(): void;
}
export default Mod;
//# sourceMappingURL=mod.d.ts.map