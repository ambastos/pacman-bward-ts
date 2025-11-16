import DrownManager from "../core/drownManager.js";
import Flood from "../core/flood.js";
declare const States: {
    IDLE_STATE: number;
    START_STATE: number;
    END_STATE: number;
    CANCEL_STATE: number;
};
declare class State {
    drownManager: DrownManager;
    started: boolean;
    flood: Flood;
    constructor(drownManager: DrownManager);
    start(): void;
    stop(): void;
    generateWave(timeToStartMS?: number): void;
    update(elapsedMs: number): void;
    draw(): void;
}
export { State, States };
//# sourceMappingURL=state.d.ts.map