declare class Timer {
    callback: Function;
    remaining: any;
    start: any;
    timerId: number;
    oldTimerId: number;
    pausedBySystem: boolean;
    constructor(callback: Function, delay: number);
    /**
     * Pauses the timer marks whether the pause came from the player
     * or the system
     * @param {Boolean} systemPause
     */
    pause(systemPause?: boolean): void;
    /**
     * Creates a new setTimeout based upon the remaining time, giving the
     * illusion of 'resuming' the old setTimeout
     * @param {Boolean} systemResume
     */
    resume(systemResume?: boolean): void;
}
export default Timer;
//# sourceMappingURL=timer.d.ts.map