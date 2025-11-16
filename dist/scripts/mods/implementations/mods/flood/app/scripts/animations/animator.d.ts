declare class Animator {
    thisClass: any;
    animations: Map<any, any>;
    started: boolean;
    onStart: any;
    onStop: any;
    constructor(thisClass: any);
    createAnimation(name: string, interval: number, duration: number | null, callback: (args: any) => void): void;
    /**
     * Plays the animation with this name
     * @param {String} name
     * @param {any} args
     */
    play(name: any, args: any): void;
    /**
     * Stops the animation with this name
     * @param {String} animationName
     */
    stopAnimation(animationName: any): void;
    setOnStart(callback: any): void;
    setOnStop(callback: any): void;
    startAnimator(): void;
    stopAnimator(): void;
    update(args?: any): void;
}
export default Animator;
//# sourceMappingURL=animator.d.ts.map