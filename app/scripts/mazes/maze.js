class Maze {
    width
    height
    mazeArray
    bounds = null
    rows
    cols
    tileSize
    constructor(mazeArray) {        
        this.mazeArray = mazeArray         
        this.mazeArray.forEach((row, rowIndex)=>{
            this.mazeArray[rowIndex] = row[0].split("")
        })
        this.rows = this.mazeArray.length
        this.cols = this.mazeArray[0].length        
    }    
    #calculateBounds() {
        const bounds = {top:[], left:[], right:[], bottom:[]}
        let content, holes=[]
        let lastRow = this.mazeArray.length-1, lastCol        
        for (let row = 0; row < this.mazeArray.length; row++) {
            lastCol = this.mazeArray[row].length-1
            for (let col = 0; col < this.mazeArray[row].length; col++) {
                content = this.mazeArray[row][col]                
                if (content !='X')
                    holes.push({x: col, y: row})
            }
            //Top bound
            if (row==0) {
                this.#createTopBounds(holes, bounds, lastCol)
            //Bottom
            }else if (row==this.mazeArray.length -1) {
                this.#createBottomBounds(holes, bounds, lastRow, lastCol)
            }
            this.#createLeftRightBounds(holes, bounds, row, lastCol)
            holes.length = 0
        }
        this.bounds = bounds
    }
    #createLeftRightBounds(holes, bounds, row, lastCol) {
        if (holes.length > 0) {
            bounds.left.push(
                { x: holes[0].x - 1, y: row }
            )   
            bounds.right.push(
                { x: holes[holes.length - 1].x+1, y: row } 
            )
        } else {
            bounds.left.push(
                { x: 0, y: row }
            )
            bounds.right.push(
                { x: lastCol, y: row }
            )
        }
    }
    #createTopBounds(holes, bounds, lastCol) {
        if (holes.length > 0) {
            bounds.top.push({ x: 1, y: 0 })
            for (let i = 0; i < holes.length; i++) {
                if (holes[(i)])
                    bounds.top.push({ x: holes[i].x - 1, y: 0 })

                else
                    bounds.top.push({ x: lastCol, y: 0 })
            }
        } else {
            bounds.top.push(
                { x: 0, y: 0 },
                { x: lastCol, y: 0 }
            )
        }
    }
    #createBottomBounds(holes, bounds, lastRow, lastCol) {
        if (holes.length > 0) {
            bounds.bottom.push(
                { x: 0, y: lastRow }
            )
            for (let i = 0; i < holes.length; i++) {
                if (holes[(i)])
                    bounds.bottom.push({ x: holes[i] - 1, y: lastRow })

                else
                    bounds.bottom.push({ x: lastCol, y: lastRow })
            }
        } else {
            bounds.bottom.push(
                { x: 0, y: lastRow },
                { x: lastCol, y: lastRow }
            )
        }
    }

    setDimensions(width, height) {
        this.width = width
        this.height = height
        this.tileSize = this.height/ this.rows
        this.#calculateBounds()
    }
    getPixelBounds(x,y) {        
        const tileSize = this.height/ this.rows
        //const col = Math.round(xConv * this.bounds)
        const row = Math.floor(y / tileSize)
        const pixelBounds = {
            top:[], left:[], right:[], bottom:[]
        }
        pixelBounds.top = []
        for (let i =0; i < this.bounds.top.length; i++) {
            pixelBounds.top.push(
                {x:Math.floor(this.bounds.top[i].x * tileSize), 
                 y: Math.floor(this.bounds.top[i].y * tileSize)}
            )
        }        
        pixelBounds.bottom = []
        for (let i =0; i < this.bounds.bottom.length; i++) {
            pixelBounds.bottom.push(
                {x:Math.floor(this.bounds.bottom[i].x * tileSize) , 
                 y:Math.floor(this.bounds.bottom[i].y * tileSize)}
            )
        }    
        if (row > 0 && row < this.rows) {
            pixelBounds.left= [
                {x:Math.floor(this.bounds.left[row].x * tileSize), 
                 y: Math.floor(this.bounds.left[row].y * tileSize)}                
            ]
            pixelBounds.right = [
                {x:Math.floor(this.bounds.right[row].x * tileSize), 
                 y: Math.floor(this.bounds.right[row].y * tileSize)},
            ]         
        }else {
            pixelBounds.left = null
            pixelBounds.right = null
        }
        return pixelBounds 
    }
}
export default Maze