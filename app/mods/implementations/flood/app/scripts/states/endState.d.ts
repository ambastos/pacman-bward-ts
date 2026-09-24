import WavesManager from '../core/wavesManager.ts';
import { State } from './state.ts';
declare class EndState extends State {
    constructor(wavesManager: WavesManager);
    start(): void;
    terminateWave(): void;
    update(elapsedMs: number): void;
    draw(): void;
}
export default EndState;
//# sourceMappingURL=endState.d.ts.map