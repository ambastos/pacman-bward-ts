import { ObservablePoint, Rectangle } from "pixi.js";
export declare function copyPosition(classThis: any, position: ObservablePoint): ObservablePoint;
export declare function createObservablePoint(classThis: any, x: number, y: number): ObservablePoint<any>;
export declare function getGridPosition(classThis: any, position: ObservablePoint, scaledTileSize: number, anchor?: ObservablePoint, scale?: number): ObservablePoint<any>;
export declare function getAnchorAxis(classThis: any, anchor: ObservablePoint, tileSize: number, scale: number): ObservablePoint<any>;
export declare function calculateDistancePos(position: ObservablePoint, targetPosition?: ObservablePoint): number;
export declare function calculateDistance(x1: number, y1: number, x2: number, y2: number): number;
export declare function lerp(a: number, b: number, t: number): number;
export declare function vLerp(a: ObservablePoint, b: ObservablePoint, t: number): ObservablePoint<any>;
/**
 *
 * @param {Rectangle} rectangle
 * @param {Number} times
 */
export declare function enlarge(rectangle: Rectangle, times?: number): Rectangle;
//# sourceMappingURL=utils.d.ts.map