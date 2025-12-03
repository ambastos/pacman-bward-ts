import { ObservablePoint, Rectangle } from "pixi.js";
import Maze from "../mazes/maze.ts";

export function copyPosition(classThis:any, position:ObservablePoint ):ObservablePoint {
    return new ObservablePoint(()=>{}, classThis, position.x, position.y) 
}
export function createObservablePoint(classThis:any, x:number, y:number) {
    return new ObservablePoint(()=>{}, classThis,x, y)
}
export function getGridPosition(classThis:any, position:ObservablePoint, 
    scaledTileSize:number, anchor?:ObservablePoint, scale?:number) {
    let ax = 0, ay = 0
    if (anchor) {
        ax = anchor.x * scale!
        ay = anchor.y * scale!
    }
    const x = ((position.x / scaledTileSize) + 0.5) - ax
    const y = ((position.y / scaledTileSize) + 0.5) - ay
    return createObservablePoint(
      classThis,x,y 
    );
}

export function getAnchorAxis(classThis:any, anchor:ObservablePoint,tileSize:number,scale:number) {
    const ax = anchor.x * tileSize * scale
    const ay = anchor.y * tileSize * scale
    return createObservablePoint(classThis, ax, ay)
}

 export function calculateDistancePos(position:ObservablePoint, targetPosition?:ObservablePoint):number {
    if (!targetPosition)
      return 0
    return Math.sqrt(
      ((position.x - targetPosition.x) ** 2) + ((position.y - targetPosition.y) ** 2),
    );
  }

  export function calculateDistance(x1:number, y1:number, x2:number, y2:number):number {
    return Math.sqrt( ((x1 - x2) ** 2) + ((y1-y2) ** 2) )
  }

  export function lerp(a:number, b:number, t:number) {
    return a + (b-a) * t
  }

  export function vLerp(a:ObservablePoint, b:ObservablePoint, t:number) {
    return createObservablePoint({},lerp(a.x, b.x, t), lerp(a.y, b.y, t))
  }

/**
 * 
 * @param {Rectangle} rectangle 
 * @param {Number} times 
 */
export function enlarge(rectangle:Rectangle, times:number=1):Rectangle {
    rectangle.x = rectangle.x * times
    rectangle.y = rectangle.y * times
    rectangle.width = rectangle.width * times
    rectangle.height = rectangle.height * times
    return rectangle 
}
