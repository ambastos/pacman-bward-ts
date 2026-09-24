import type WavesManager from "../core/wavesManager.ts";
import { State } from "./state.ts";
declare class CancelState extends State {
    constructor(wavesManager: WavesManager);
    start(): void;
    endFlood(): void;
    update(elapsedMs: number): void;
    draw(): void;
}
export default CancelState;
//# sourceMappingURL=cancelState.d.ts.map