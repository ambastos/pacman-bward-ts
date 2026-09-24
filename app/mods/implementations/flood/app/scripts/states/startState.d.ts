import WavesManager from '../core/wavesManager.ts';
import { State } from './state.ts';
declare class StartState extends State {
    constructor(wavesManager: WavesManager);
    update(elapsedMs: number): void;
    draw(): void;
}
export default StartState;
//# sourceMappingURL=startState.d.ts.map