import type WavesManager from "../core/wavesManager.ts";
import type Flood from "../core/flood.ts";
declare const States: {
    IDLE_STATE: number;
    START_STATE: number;
    END_STATE: number;
    CANCEL_STATE: number;
};
declare class State {
    wavesManager: WavesManager;
    started: boolean;
    flood: Flood;
    className: string;
    constructor(wavesManager: WavesManager);
    start(): void;
    stop(): void;
    generateWave(timeToStartMS?: number): void;
    update(elapsedMs: number): void;
    draw(): void;
}
export { State, States };
//# sourceMappingURL=state.d.ts.map