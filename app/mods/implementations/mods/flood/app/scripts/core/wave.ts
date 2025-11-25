import { Container, DisplayObject, Graphics, Polygon, Sprite, Texture } from "pixi.js"
import WavesManager from "./wavesManager.ts"
import Maze from "../../../../../../../scripts/mazes/maze.ts"
import EntitiesManager from "./entitiesManager.ts"
import { getMazeWays } from "../utils/util.ts"
import MovableEntity from "../../../../../../../scripts/characters/movableEntity.ts"
import { ObjectsGroup } from "../types/types.ts"

class Wave extends Sprite {
    speedY = 15    
    startTime = 0
    started = false
    decreasing = false
    lastTime = 0
    maze: Maze
    //entitiesManager: EntitiesManager
    wavesManager: WavesManager
    gp: Graphics
    container: Container
    startTopY: number
    duration!:number
    elements:Sprite[] = []
    queuedList:any[] = []
    constructor(wavesManager: WavesManager, maze: Maze, width: number, height: number) {        
        super(Texture.WHITE)           
        this.width = width
        this.height = height 
        this.visible = false   
        this.alpha = 0  
        this.zIndex = 2
        //this.tint = "0x56DBE3"
        this.maze = maze                             
        this.wavesManager = wavesManager  
        this.wavesManager.wave = this                       
        this.gp = this.wavesManager.gp 
         
        this.gp.zIndex = this.zIndex
        this.container = this.wavesManager.gc.stage 
        //if (this.container.children.length > 0) 
        this.container.addChild(this.gp)

        this.startTopY = Math.PI * 2
   
        this.generateBubbles()
        this.wavesManager.tryToGenerateEntities() 
    }
    queueElement(type:string, element:Exclude<Sprite, MovableEntity>) {
        const id = Date.now()
        element.name = type
        Object.defineProperty(element,"id",{value:id})
        this.queuedList.push(element) 
    }
    queuedElementsBy(type:string) {   
        return this.queuedList.filter(f=>{return f.name == type})
    }
    protected dequeueElement(element:any):boolean {   
        const contains =  this.queuedList.lastIndexOf(element) > -1
        this.queuedList = this.queuedList.filter(f=>f.id != element.id)
        return contains
    }
    addElement(element:Sprite) { 
        this.elements.push(element)
        this.container.addChild(element)  
    }    
    removeElement(element:Sprite) {
        this.elements.splice(this.elements.indexOf(element), 1)
        this.container.removeChild(element)
    }
    clearElements() {
        const objects =  this.elements
        objects!.forEach((el:any)=>{            
            this.container.removeChild(el)
        })
        objects!.length = 0        
    }
    getElementsBy(name?:string):Sprite[]  {        
        return this.elements.filter(f=>f.name == name)
    }
    private generateBubbles() { 
        let numberOfBubles = Math.ceil(Math.random() * 3)
        let wayCells = getMazeWays(this.maze)
        let rows = wayCells.map((m: { row:number })=>m.row)  
        const tileSize = this.maze.tileSize
        for (let i = 1; i <= numberOfBubles; i++) {
            let indexRow = Math.floor(Math.random() * (rows.length - 1))
            let row = rows[indexRow]
            let cols = wayCells.find((f: { row: number} ) => f.row == row)!.cols
            let indexCol = Math.floor(Math.random() * (cols.length - 1))
            let col = cols[indexCol]
            const pixelBounds = this.maze.getPixelCoordinates(col!, row!) 

            const bubble = new Sprite(this.wavesManager.flood.am.getTexture("bubbles"))
            //bubleSprite.tint = 0x002400
            //bubleSprite.alpha = 0.6 
            bubble.height = tileSize  
            bubble.width = tileSize
            bubble.position.set(pixelBounds.x, pixelBounds.y)
            this.queueElement("bubble", bubble)
        }
    }
    private getGeneratedBubbles() {
        const bubbles =  this.queuedElementsBy("bubble")
        for (let i = 0; i < bubbles.length; i++) {
            const bubble = bubbles[i]
            const grid = this.maze.getGridPosition(bubble.x, bubble.y)
            const waveGrid = this.maze.getGridPosition(this.x, this.y)
            if (grid.y == waveGrid.y) {  
                this.addElement(bubble)    
                this.dequeueElement(bubble)
            }
        }
    }
    increase(elapsedMs: number) {
        if (this.visible) {
            this.height+=this.speedY * (elapsedMs/1000)
            this.decreasing = false
            this.updatePosition()
            this.getGeneratedBubbles()   
            this.wavesManager.entitiesManager.dequeAllEntities()             
        }
    }
    decrease(elapsedMs: number) {
        if (this.visible) {            
            this.height -=this.speedY * 1.3 * (elapsedMs/1000)
            this.decreasing = true
            this.updatePosition()            
            //console.log("decrease wave: ", this.height, this.position)
            const bubbles =  this.getElementsBy("bubble")
            for (let i=0;i< bubbles.length; i++) {                
                const bubble = bubbles[i] as Sprite
                if (bubble.y <= this.y) {                                          
                    this.removeElement(bubble)
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
        this.clearElements()
        // const bubles = this.container.children.filter((f: DisplayObject)=>f.name=='buble')
        // for (let i = bubles.length -1; i >= 0; i--) {
        //     this.container.removeChild(bubles[i] as DisplayObject)
        // }
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