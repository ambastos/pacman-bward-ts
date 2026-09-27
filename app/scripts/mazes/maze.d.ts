import { ObservablePoint } from "pixi.js";
declare class Maze {
    #private;
    width: number;
    height: number;
    mazeArray: string[][];
    bounds: {
        top: ObservablePoint[];
        left: ObservablePoint[];
        right: ObservablePoint[];
        bottom: ObservablePoint[];
    };
    rows: number;
    cols: number;
    tileSize: number;
    /**Ghost houses boundaries in grid coordinates */
    ghostHouses: any[];
    pixelBounds: any;
    constructor(mazePrp: any);
    getWays(): {
        row: number;
        cols: number[];
    }[];
    private createTopBounds;
    private createBottomBounds;
    setDimensions(width: number, height: number): void;
    /**
     * Transform values in cordinates from grid coordinates
     * @param x
     * @param y
     */
    getGridPosition(x: number, y: number): ObservablePoint;
    /**
     * Gets the pixel position from GridPosition
     * @param {x} GridPosition.x
     * @param {y} GridPostion.y
     * @returns
     */
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