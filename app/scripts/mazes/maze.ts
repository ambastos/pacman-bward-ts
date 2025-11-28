import { ObservablePoint } from "pixi.js"
import { createObservablePoint, getGridPosition } from "../utilities/utils.ts"

class Maze {
    width!: number
    height!: number
    mazeArray:string[][]
    bounds!:{top:[], left:[], right:[], bottom:[]}
    rows:number
    cols:number
    tileSize!: number
    /**Ghost houses boundaries in grid coordinates */
    ghostHouses: any
    pixelBounds: any
    constructor(mazePrp: any) {        

        this.mazeArray = mazePrp.mazeArray         
        this.mazeArray.forEach((row: string[], rowIndex: number)=>{
            this.mazeArray[rowIndex] = row[0]!.split("")
        })
        this.rows = this.mazeArray.length
        this.cols = this.mazeArray[0]!.length        
        this.ghostHouses = mazePrp.ghostHouses
    }    
    #calculateBounds() {
        const bounds = {top:[] as any, left:[] as any, right:[] as any, bottom:[] as any}
        const pixelBounds = {top:[], left:[], right:[], bottom:[]}
        let content, holes=[]
        let lastRow = this.mazeArray.length-1, lastCol        
        for (let row = 0; row < this.mazeArray.length; row++) {
            lastCol = this.mazeArray[row]!.length-1
            for (let col = 0; col < this.mazeArray[row]!.length; col++) {
                content = this.mazeArray[row]![col]                
                if (content !='X')
                    holes.push({x: col, y: row})
            } 
            //Top bound
            if (row==0) { 
                this.createTopBounds(bounds, pixelBounds, holes, lastCol)
            //Bottom
            }else if (row==this.mazeArray.length -1) {
                this.createBottomBounds(bounds, pixelBounds, holes, lastRow, lastCol)
            }
            this.#createLeftRightBounds(bounds,pixelBounds, holes, row, lastCol)
            holes.length = 0
        }
        this.bounds = bounds
        this.pixelBounds = pixelBounds
    }
    #createLeftRightBounds(bounds: { left: ObservablePoint[]; right: ObservablePoint[] }, 
            pixelBounds: { left: ObservablePoint[]; right: ObservablePoint[] }, holes: string | any[], row: number, lastCol: number) {
        if (holes.length > 0) {
            bounds.left.push(
                createObservablePoint(this, holes[0].x - 1, row)
            )               
            bounds.right.push(
                createObservablePoint(this, holes[holes.length - 1].x+1, row)
            )            
            pixelBounds.left.push(
                createObservablePoint(this, (holes[0].x - 1) * this.tileSize, row* this.tileSize)
            )
            pixelBounds.right.push(
                createObservablePoint(this, (holes[holes.length - 1].x+1) * this.tileSize, row*this.tileSize)
            )
        } else {
            bounds.left.push(
                createObservablePoint(this,0,row)
            )
            bounds.right.push(
                createObservablePoint(this,lastCol,row)
            )
            pixelBounds.left.push(
                createObservablePoint(this,0,row * this.tileSize)
            )
            pixelBounds.right.push(
                createObservablePoint(this, lastCol * this.tileSize,row * this.tileSize)
            )
        }
    }
    private createTopBounds(bounds: { top: { x: number; y: number }[] }, pixelBounds: { top: { x: number; y: number }[] }, holes: string | any[], lastCol: number) {
        if (holes.length > 0) {
            bounds.top.push({ x: 1, y: 0 })
            for (let i = 0; i < holes.length; i++) {
                if (holes[(i)]) {
                    bounds.top.push({ x: holes[i].x - 1, y: 0 })
                    pixelBounds.top.push(
                        {x:Math.floor(holes[i].x * this.tileSize), 
                        y:0}
                    )
                }else{
                    bounds.top.push({ x: lastCol, y: 0 })
                    pixelBounds.top.push(
                        {x:Math.floor(lastCol * this.tileSize), y:0}
                    )
                }
            }
              
        } else {
            bounds.top.push(
                { x: 0, y: 0 },
                { x: lastCol, y: 0 }
            )
            pixelBounds.top.push(
                {x:0, y:0},
                {x:Math.floor(lastCol * this.tileSize), y:0}
            )
        }
    }
    private createBottomBounds(bounds: { bottom: { x: any; y: any }[] }, 
        pixelBounds: any, holes: string | any[], lastRow: number, lastCol: number) {
        if (holes.length > 0) {
            bounds.bottom.push(
                { x: 0, y: lastRow }
            )
            for (let i = 0; i < holes.length; i++) {
                if (holes[(i)]) {
                    bounds.bottom.push({ x: holes[i].x - 1, y: lastRow })
                    pixelBounds.top.push(
                        {x:Math.floor((holes[i].x -1) * this.tileSize), y:lastRow * this.tileSize}
                    )
                }else {
                    bounds.bottom.push({ x: lastCol, y: lastRow })
                    pixelBounds.top.push(
                        {x:Math.floor(lastCol * this.tileSize), y:lastRow * this.tileSize}
                    )
                }
            }
        } else {
            bounds.bottom.push(
                { x: 0, y: lastRow },
                { x: lastCol, y: lastRow }
            )
            pixelBounds.bottom.push(
                { x: 0, y: lastRow *this.tileSize },
                { x: lastCol * this.tileSize, y: lastRow  * this.tileSize}
            )
        }
    }
    setDimensions(width: number, height: number) {
        this.width = width
        this.height = height
        this.tileSize = this.height/ this.rows
        this.#calculateBounds()
    }
    /**
     * Transform values in cordinates from grid coordinates
     * @param x 
     * @param y 
     */
    getGridPosition(x:number, y:number) {
        return { 
            x:(x / this.tileSize) + 0.5,
            y:(y / this.tileSize) + 0.5
        }
    }
    /**
     * Gets the pixel position from GridPosition
     * @param x GridPosition.x
     * @param y GridPostion.y
     * @returns 
     */
    getPixelCoordinates(x: number,y: number) {
        return {x: x * this.tileSize, y: y * this.tileSize}
    }    
    getPixelBounds(x: number,y: number) {      
        const row = Math.floor(y / this.tileSize)
        // const index = this.pixelBounds.left.map((f,i)=>{
        //     if (f.x == x && f.y == y)
        //         return i
        //     else 
        //         return null
        // }).find(f=>f!=null)  
        let left:any = [this.pixelBounds.left[row]]
        if (!this.pixelBounds.left[row])
            left = null 
        let right:any = [this.pixelBounds.right[row]]
        if (!this.pixelBounds.right[row])    
            right = null
        return {
            top: this.pixelBounds.top,
            bottom: this.pixelBounds.bottom,
            left: left,
            right: right
        }
    }
}
export default Maze