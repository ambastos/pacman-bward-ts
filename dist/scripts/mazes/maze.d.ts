declare class Maze {
    #private;
    width: number;
    height: number;
    mazeArray: string[][];
    bounds: {
        top: [];
        left: [];
        right: [];
        bottom: [];
    };
    rows: number;
    cols: number;
    tileSize: number;
    ghostHouses: any;
    pixelBounds: any;
    constructor(mazePrp: any);
    private createTopBounds;
    private createBottomBounds;
    setDimensions(width: number, height: number): void;
    getPixelCoordinates(x: number, y: number): {
        x: number;
        y: number;
    };
    getPixelBounds(x: number, y: number): {
        top: any;
        bottom: any;
        left: any;
        right: any;
    };
}
export default Maze;
//# sourceMappingURL=maze.d.ts.map