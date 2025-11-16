"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Maze {
    width;
    height;
    mazeArray;
    bounds;
    rows;
    cols;
    tileSize;
    ghostHouses;
    pixelBounds;
    constructor(mazePrp) {
        this.mazeArray = mazePrp.mazeArray;
        this.mazeArray.forEach((row, rowIndex) => {
            this.mazeArray[rowIndex] = row[0].split("");
        });
        this.rows = this.mazeArray.length;
        this.cols = this.mazeArray[0].length;
        this.ghostHouses = mazePrp.ghostHouses;
    }
    #calculateBounds() {
        const bounds = { top: [], left: [], right: [], bottom: [] };
        const pixelBounds = { top: [], left: [], right: [], bottom: [] };
        let content, holes = [];
        let lastRow = this.mazeArray.length - 1, lastCol;
        for (let row = 0; row < this.mazeArray.length; row++) {
            lastCol = this.mazeArray[row].length - 1;
            for (let col = 0; col < this.mazeArray[row].length; col++) {
                content = this.mazeArray[row][col];
                if (content != 'X')
                    holes.push({ x: col, y: row });
            }
            //Top bound
            if (row == 0) {
                this.createTopBounds(bounds, pixelBounds, holes, lastCol);
                //Bottom
            }
            else if (row == this.mazeArray.length - 1) {
                this.createBottomBounds(bounds, pixelBounds, holes, lastRow, lastCol);
            }
            this.#createLeftRightBounds(bounds, pixelBounds, holes, row, lastCol);
            holes.length = 0;
        }
        this.bounds = bounds;
        this.pixelBounds = pixelBounds;
    }
    #createLeftRightBounds(bounds, pixelBounds, holes, row, lastCol) {
        if (holes.length > 0) {
            bounds.left.push({ x: holes[0].x - 1, y: row });
            bounds.right.push({ x: holes[holes.length - 1].x + 1, y: row });
            pixelBounds.left.push({ x: (holes[0].x - 1) * this.tileSize, y: row * this.tileSize });
            pixelBounds.right.push({ x: (holes[holes.length - 1].x + 1) * this.tileSize, y: row * this.tileSize });
        }
        else {
            bounds.left.push({ x: 0, y: row });
            bounds.right.push({ x: lastCol, y: row });
            pixelBounds.left.push({ x: 0, y: row * this.tileSize });
            pixelBounds.right.push({ x: lastCol * this.tileSize, y: row * this.tileSize });
        }
    }
    createTopBounds(bounds, pixelBounds, holes, lastCol) {
        if (holes.length > 0) {
            bounds.top.push({ x: 1, y: 0 });
            for (let i = 0; i < holes.length; i++) {
                if (holes[(i)]) {
                    bounds.top.push({ x: holes[i].x - 1, y: 0 });
                    pixelBounds.top.push({ x: Math.floor(holes[i].x * this.tileSize),
                        y: 0 });
                }
                else {
                    bounds.top.push({ x: lastCol, y: 0 });
                    pixelBounds.top.push({ x: Math.floor(lastCol * this.tileSize), y: 0 });
                }
            }
        }
        else {
            bounds.top.push({ x: 0, y: 0 }, { x: lastCol, y: 0 });
            pixelBounds.top.push({ x: 0, y: 0 }, { x: Math.floor(lastCol * this.tileSize), y: 0 });
        }
    }
    createBottomBounds(bounds, pixelBounds, holes, lastRow, lastCol) {
        if (holes.length > 0) {
            bounds.bottom.push({ x: 0, y: lastRow });
            for (let i = 0; i < holes.length; i++) {
                if (holes[(i)]) {
                    bounds.bottom.push({ x: holes[i].x - 1, y: lastRow });
                    pixelBounds.top.push({ x: Math.floor((holes[i].x - 1) * this.tileSize), y: lastRow * this.tileSize });
                }
                else {
                    bounds.bottom.push({ x: lastCol, y: lastRow });
                    pixelBounds.top.push({ x: Math.floor(lastCol * this.tileSize), y: lastRow * this.tileSize });
                }
            }
        }
        else {
            bounds.bottom.push({ x: 0, y: lastRow }, { x: lastCol, y: lastRow });
            pixelBounds.bottom.push({ x: 0, y: lastRow * this.tileSize }, { x: lastCol * this.tileSize, y: lastRow * this.tileSize });
        }
    }
    setDimensions(width, height) {
        this.width = width;
        this.height = height;
        this.tileSize = this.height / this.rows;
        this.#calculateBounds();
    }
    getPixelCoordinates(x, y) {
        return { x: x * this.tileSize, y: y * this.tileSize };
    }
    getPixelBounds(x, y) {
        const row = Math.floor(y / this.tileSize);
        // const index = this.pixelBounds.left.map((f,i)=>{
        //     if (f.x == x && f.y == y)
        //         return i
        //     else 
        //         return null
        // }).find(f=>f!=null)  
        let left = [this.pixelBounds.left[row]];
        if (!this.pixelBounds.left[row])
            left = null;
        let right = [this.pixelBounds.right[row]];
        if (!this.pixelBounds.right[row])
            right = null;
        return {
            top: this.pixelBounds.top,
            bottom: this.pixelBounds.bottom,
            left: left,
            right: right
        };
    }
}
exports.default = Maze;