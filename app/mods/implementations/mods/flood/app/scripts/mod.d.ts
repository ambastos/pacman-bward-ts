import EventEmitter from "eventemitter3";
import GameCoordinator from "../../../../../../scripts/core/gameCoordinator.ts";
/**
 * Module class to pacmam-bward game
 */
declare class Mod {
    emitter: EventEmitter;
    gc: GameCoordinator;
    started: boolean;
    paused: boolean;
    initialized: boolean;
    scale: number;
    constructor(gameCoordinator: GameCoordinator);
    initialize(): void;
    getResources(): never[];
    loadAssets(callback: unknown): Promise<Record<string, any> | null>;
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