declare class Debugger {
    gc: any;
    overflowMask: any;
    mazeDiv: any;
    mazeArray: any;
    tileSize: any;
    pacmanImmortal: boolean;
    printMazeGrid: boolean;
    infoPanel: any;
    canvas: HTMLCanvasElement;
    shouldPrintGrid: boolean;
    printing: any;
    constructor(gameCoordinator: any);
    handleInput(): void;
    createCanvas(): void;
    moveInUnits(direction: string, units: number): void;
    mazeGrid(printGrid: boolean): void;
    printGrid(): void;
    clearGrid(): void;
    configInfoPanel(): void;
    makePacmanImortal(isImmortal: boolean): void;
    drawEntities(isDraw: boolean): void;
    moveEntities(): void;
    notifyPacmanMovement(): void;
    startWave(): void;
    _notify(functionName: any): void;
    _notify2(functionName: string): void;
}
export default Debugger;
//# sourceMappingURL=debugger.d.ts.map