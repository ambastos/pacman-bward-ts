import { ObservablePoint } from "pixi.js";

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