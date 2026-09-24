import WavesManager from '../core/wavesManager.ts';
import { State } from './state.ts';
declare class IdleState extends State {
    constructor(wavesManager: WavesManager);
    generateWave(timeToStartMS?: number): void;
    randomWaveTimeMs(): number;
    start(): void;
    update(elapsedMs: number): void;
    draw(): void;
}
export default IdleState;
//# sourceMappingURL=idleState.d.ts.map