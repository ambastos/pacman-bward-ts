declare class Animation {
    #private;
    startTime: number | null;
    currentTime: number | null;
    interval: number;
    duration: number | null;
    playing: boolean;
    end: boolean;
    endTime: number | null;
    callback: Function;
    args: never[];
    thisClass: any;
    constructor(interval: number, duration: number | null, callback: ((args: any) => void), thisClass: any);
    reset(): void;
    play(keys_values_args: any): void;
    stop(): void;
    update(args: any): void;
    updateArguments(args: any, passArgsFirst: boolean): void;
}
export default Animation;
//# sourceMappingURL=animation.d.ts.map