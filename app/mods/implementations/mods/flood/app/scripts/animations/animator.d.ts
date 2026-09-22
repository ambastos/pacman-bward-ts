import Animation from "./animation.ts";
declare class Animator {
    thisClass: any;
    animations: Map<string, Animation>;
    currentAnimation: {
        name: string | null;
        animation: Animation | null;
    };
    started: boolean;
    onStart: any;
    onStop: any;
    constructor(thisClass: any);
    createAnimation(name: string, interval: number, duration: number | null, callback: (args: any) => void): Animation;
    /**
     * Reset the current animation to replay again
     * @param name
     */
    restart(name: string): void;
    isPlaying(name: string): boolean | undefined;
    /**
     * Plays the animation with this name
     * @param {string} name
     * Default is pause previous animations, if it's true keep play previous ones
     * @param keepRunningPreviousAnimation {boolean}
     * @param {any} args
     */
    play(name: string, args?: any, keepRunningPreviousAnimation?: boolean): void;
    /**
     * Stops the animation with this name
     * @param {String} animationName
     */
    stopAnimation(animationName: any): void;
    startAnimator(): void;
    stopAnimator(): void;
    update(args?: any): void;
}
export default Animator;
//# sourceMappingURL=animator.d.ts.map