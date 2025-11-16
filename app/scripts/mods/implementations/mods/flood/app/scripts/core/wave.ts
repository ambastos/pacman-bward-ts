import { Container, DisplayObject, Graphics, Polygon, Sprite, Texture } from "pixi.js"
import Maze from "../../../../../../../mazes/maze.js"
import DrownManager from "./drownManager.js"

class Wave extends Sprite {
    speedY = 15    
    startTime = 0
    started = false
    decreasing = false
    lastTime = 0
    maze: Maze 
    drownManager: DrownManager
    gp: Graphics
    container: Container
    startTopY: number
    bublesLocation!: any[]
    duration!:number
    constructor(drownManager: DrownManager, maze: Maze, width: number, height: number) {        
        super(Texture.WHITE)   
        this.width = width
        this.height = height 
        this.visible = false   
        this.alpha = 0  
        //this.tint = "0x56DBE3"
        this.maze = maze                             
        this.drownManager = drownManager                 
        this.gp = this.drownManager.gp 
        this.container = this.drownManager.flood.container
        //if (this.container.children.length > 0) 
        this.container.addChild(this.gp) 

        this.startTopY = Math.PI * 2
        let numberOfBubles = Math.ceil(Math.random() * 3) 
        let wayCells = this.maze.mazeArray.map((f: any[],i: any, a: any)=>{ 
            var rr = f.map((g: string,j: any)=>{   
                if  (g == 'o') 
                    return j
                else 
                    return null
            })  
            return {"row": i, "cols":rr.filter((f: null)=>f!=null)}
        }).filter((f: { cols: string | any[] },i: any)=>{  
            return f.cols.length > 0
        })
        let rows = wayCells.map((m: { row:number })=>m.row)
        this.bublesLocation = []
        for (let i=1; i <= numberOfBubles;i++) {
            let indexRow = Math.floor(Math.random() * (rows.length -1))
            let row = rows[indexRow]
            let cols =  wayCells.find((f: { row: number })=>f.row == row)!.cols
            let indexCol =  Math.floor(Math.random() * (cols.length - 1))
            let col = cols[indexCol]
            this.bublesLocation.push({
                row: row,
                col: col
            })
        } 

    }
    increase(elapsedMs: number) {
        if (this.visible) {
            this.height+=this.speedY * (elapsedMs/1000)
            this.decreasing = false
            this.updatePosition()
            //console.log("increase wave: ", this.height, this.position)
            let buble
            const tileSize = this.maze.tileSize
            for (let i=0;i< this.bublesLocation.length; i++) {
                const pixelBounds = this.maze.getPixelCoordinates(
                    this.bublesLocation[i].col,this.bublesLocation[i].row
                )
                if (pixelBounds.y == this.y) {    
                    buble = this.bublesLocation[i]                
                    const bubleSprite = new Sprite(Texture.WHITE)
                    bubleSprite.tint = 0x002400
                    bubleSprite.alpha = 0.6
                    bubleSprite.name = "buble"
                    bubleSprite.height = tileSize
                    bubleSprite.width = tileSize
                    bubleSprite.position.set(pixelBounds.x, pixelBounds.y)
                    this.container.addChild(bubleSprite)
                }
            } 
        }
    }
    decrease(elapsedMs: number) {
        if (this.visible) {            
            this.height -=this.speedY * 1.3 * (elapsedMs/1000)
            this.decreasing = true
            this.updatePosition()            
            //console.log("decrease wave: ", this.height, this.position)
            for (let i=0;i< this.bublesLocation.length; i++) {
                const pixelBounds = this.maze.getPixelCoordinates(
                    this.bublesLocation[i].col,this.bublesLocation[i].row
                )
                if (pixelBounds.y <= this.y) {                      
                    const buble = this.container.children.find((f: DisplayObject)=>{
                        if (f.name == 'buble') { 
                            if (f.y <= this.y)
                                return f
                        }
                    })
                    if (buble)
                        this.container.removeChild(buble)
                }
            } 
        }
    }
    updatePosition() {
       this.y = this.maze.height - this.height
       //this.y = 100
    }
    get isDescreasing() {
        return this.decreasing
    }
    cancel() {
        this.started = false
        const bubles = this.container.children.filter((f: DisplayObject)=>f.name=='buble')
        for (let i = bubles.length -1; i >= 0; i--) {
            this.container.removeChild(bubles[i] as DisplayObject)
        }
    }
    show() {
        this.visible = true
    }
    draw() { 
        const gp = this.gp        
        gp.clear() 
        const tileSize = this.maze.tileSize
        if (this.height < 4)
            return
        let bounds = this.maze.getPixelBounds(this.x, this.y)
        // this.x = bounds.left[0].x 
        // this.width = bounds.right[0].x
        if (bounds.left == null) {
            bounds.left = [{x: this.x, y: this.y}]
            bounds.right = [{x: this.width, y: this.y}] 
        }
        let x = bounds.left[0].x + tileSize/2
        let y= bounds.left[0].y + (this.y - bounds.left[0].y)
        const points = []        
        let percent = 0.1
        // y += 2 * Math.sin(this.startTopY) 
        // points.push(x,y)
        //This create the wave itself
        let index = 0   
        let coefX = 2, coefY = 1.2
        gp.lineStyle(2,0xffffff)
        while(x <= bounds.right[0].x) {  
            if (index == 0) {                
                x-=this.startTopY;
            } 
            y = this.y            
            //points.push(x,y)             
            for (let i=0; i < Math.PI; i+=Math.PI*percent) {
                x +=coefX * Math.sin(i ) 
                y +=coefY * Math.cos(i)     
                points.push(x,y)
            }
            index++
        }
        //gp.lineStyle(0,0x000000, 0)
        //TOP bound
        points.push(x,y)
        x = bounds.right[0].x + tileSize/2
        points.push(x,y)
        //Right BOUNDs
        let y2, lastY = y, prevBounds
        for (let h=0; h < this.height; h+=tileSize) {
            y2 = lastY +  h
            prevBounds = bounds
            bounds = this.maze.getPixelBounds(x, y2)
            if (!bounds.right || bounds.right[0].y < this.y) 
                continue
            y = bounds.right[0].y
            if (prevBounds?.right && prevBounds.right[0].x != bounds.right[0].x) {
                x = prevBounds.right[0].x + tileSize/2
                //y = prevBounds.right[0].y
                points.push(x,y)
            }
            x = bounds.right[0].x + tileSize/2
            points.push(x,y)
        }
        //x += tileSize
        //points.push(x, y)
        //BOTTOM bound
        bounds = this.maze.getPixelBounds(x, y)        
        x -= bounds.right[0].x + tileSize/2
        points.push(x,y)
        //Left Bounds
        lastY = y 
        let nextBounds
        for (let h=0; h < this.height; h+=tileSize) {
            y2 = lastY -  h
            nextBounds = this.maze.getPixelBounds(x, y2-tileSize)
            bounds = this.maze.getPixelBounds(x, y2)
            if (!bounds.left || bounds.left[0].y < this.y) 
                continue
            y = bounds.left[0].y 
            x = bounds.left[0].x + tileSize/2//+this.startTopY
            points.push(x,y)
            if (nextBounds?.left && nextBounds.left[0].x != bounds.left[0].x) {
                x = nextBounds.left[0].x + tileSize/2
                points.push(x,y)
            }
        }
        //x = this.x
        //y = this.y
        //Close the path
        if (bounds.left) {
            x = bounds.left[0].x + tileSize/2
            y = bounds.left[0].y
            points.push(x,y)
        }
        const poly = new Polygon(points)
        gp.beginFill(0x56DBE3,0.5)
        gp.drawShape(poly)

        //Interval to draw the waves in mileseconds
        const shouldChange = Date.now() - this.lastTime >= 200
        if (shouldChange) {
            this.lastTime = Date.now()            
            if(this.startTopY ==  Math.PI * 2) {
               this.startTopY = Math.PI
            }else if (this.startTopY == Math.PI) {  
                this.startTopY = 0
            }else {
                this.startTopY = Math.PI * 2
            }
        }
    }
}
export default Wave