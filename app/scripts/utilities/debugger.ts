import { BaseImageResource, CanvasResource, ICanvas, ObservablePoint, Rectangle, Texture } from "pixi.js"
import GameCoordinator from "../core/gameCoordinator.ts"
import MovableEntity from "../characters/movableEntity.ts"


class Debugger {
    gc: GameCoordinator
    overflowMask: any
    mazeDiv: any
    mazeArray: any
    tileSize: number
    scale:number
    pacmanImmortal: boolean
    printMazeGrid: boolean
    infoPanel: any
    canvas!: HTMLCanvasElement
    ctx!:CanvasRenderingContext2D
    shouldPrintGrid!: boolean
    enableBoundsAndHitBoxes: boolean = false
    printing: any
    constructor(gameCoordinator: GameCoordinator) {
        this.gc = gameCoordinator
        this.overflowMask = $("#overflow-mask")
        this.mazeDiv = $(this.gc.mazeDiv)
        this.mazeArray = this.gc.mazeArray
        this.scale = this.gc.scale
        this.tileSize = this.gc.scaledTileSize
        this.pacmanImmortal = false
        this.printMazeGrid = false
        this.createCanvas()
        this.handleInput()  
        this.configInfoPanel()
        window.debug = this
        this.animate()
    }

    handleInput() {
        const dbg = this
        window.addEventListener('keydown',(event)=>{
            if (event.key == '3')
                dbg.makePacmanImortal(true)
            else if (event.key == '4')
                dbg.makePacmanImortal(false)
            else if (event.key == '1')
                dbg.shouldPrintGrid = true
            else if (event.key == '2')
                dbg.shouldPrintGrid = false
            else if (event.key == '5')
                dbg.infoPanel.log()
            else if (event.key == '7') 
                dbg.drawEntities(false)
            else if (event.key == '8') 
                dbg.drawEntities(true)
            else if (event.key == ',') //<
                dbg.moveInUnits('left', 1)
            else if (event.key == '.') //> 
                dbg.moveInUnits('right', 1)
            else if (event.key == ' ') //> 
                dbg.moveEntities() 
            else if (event.key == 'u')    
                dbg.notifyPacmanMovement()
            else if (event.key.toLowerCase() == 'f')    
                dbg.startWave()
            else if( event.key.toLowerCase() == 'h') {
                dbg.enableBoundsAndHitBoxes = !dbg.enableBoundsAndHitBoxes
            }            
        } )
    }
 
    createCanvas() {
        this.canvas = document.createElement('canvas')
        this.canvas.id = 'canvasD'
        document.body.append(this.canvas)

        const canvas = $(this.canvas)
        const mazeDiv = $(this.gc.mazeDiv)
        canvas.css('position', 'absolute')
        canvas.css('left',0)
        canvas.css('top', 0)
        canvas.width(this.overflowMask.width())
        canvas.height(this.overflowMask.height())
        this.canvas.width = this.overflowMask.width()
        this.canvas.height = this.overflowMask.height()
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D
        
        // let canvasP = document.createElement('canvas')
        // canvasP.width = 400
        // canvasP.height = 300
        // document.body.appendChild(canvasP)
        // $(canvasP).css("position", "absolute")
        // .css("top", "0px").css("left", "0px")
        
        // this.renderer = new Renderer({
        //      width: 400,
        //      height: 500, 
        //      antialias: false, transparent: false, 
        //      resolution: 1, view: canvasP
        // })
        // this.container1 = new Container()
        // this.mainContainer = new Container() 
        // this.mainContainer.addChild(this.container1)
    }
    // renderObject(pixiObject) {
    //     this.container1.addChild(pixiObject)        
    // }
    // render() {
    //     this.renderer.render(this.mainContainer)
    // }

    moveInUnits(direction: string, units: number) {
        const elapsedMs = this.gc.gameEngine.elapsedMs
        let position = this.gc.pacman.position
        const velocityPerMs = this.gc.pacman.velocityPerMs
        let newPositions
        for (let i = 0; i < units; i++) {
            newPositions = this.gc.pacman.characterUtil.determineNewPositions(position, 
                direction, velocityPerMs, elapsedMs, this.gc.pacman.scaledTileSize,
                this.gc.pacman.anchor, this.gc.scale
            )
            position = newPositions.newPosition
        }
        this.gc.pacman.position = position
    }
    animate() {
        const an = () =>{
            this.clearGrid()
            if (this.shouldPrintGrid) {
                this.printGrid()
            }else if(this.enableBoundsAndHitBoxes) {
                this.drawBoundsAndHitBoxes(false)
            }
            requestAnimationFrame(an)
        }
        an()
    }

    printGrid() {
        const mazeX = this.mazeDiv.position().left
        const mazeY = this.mazeDiv.position().top
        const width = this.mazeDiv.width() / this.scale
        const height = this.mazeDiv.height()/ this.scale
        let ctx = this.canvas.getContext("2d")      
        ctx?.save()
        ctx?.translate(mazeX, mazeY)
        ctx?.scale(2,2)
        ctx!.strokeStyle = 'green'   
        ctx!.lineWidth = 1
    
        let x = 0, y =0
        const tileSize = this.tileSize
        //ctx!.scale(this.scale,this.scale)
        ctx!.clearRect(0,0, width, height) 
        ctx!.beginPath()
        ctx!.moveTo(0,0)
        this.mazeArray.forEach((row: any[], rowIndex: number)=>{
            if (rowIndex > 0) {
                x = 0
                y+= tileSize 
            }
            ctx!.moveTo(x,y)
            ctx!.lineTo(width, y)
            row.forEach((col: any, colIndex: number)=>{
                //ctx!.strokeRect(x,y, this.tileSize, this.tileSize) 
                ctx!.moveTo(x,y)
                ctx!.lineTo(x,y+ tileSize)
                x+=this.tileSize
                if (colIndex == this.mazeArray[rowIndex].length - 1) {
                    ctx!.moveTo(x, y)  
                    ctx!.lineTo(x,y+ tileSize)      
                }
            })
            if (rowIndex == this.mazeArray.length - 1) {
                y+=tileSize
                ctx!.moveTo(0, y)
                ctx!.lineTo(width, y)
            }            
        })   
        ctx!.stroke()     
        ctx!.strokeStyle = 'yellow'
        const pacX = this.gc.pacman.position.x 
        const pacY = this.gc.pacman.position.y 
        ctx!.strokeRect(pacX, pacY, tileSize * 2, tileSize * 2)
        ctx!.strokeStyle = 'red'
        ctx!.strokeRect(pacX, pacY, tileSize, tileSize)
        ctx!.stroke()
        ctx?.restore()
    }
    clearGrid() {
        const mazeX = this.mazeDiv.offset().left
        const mazeY = this.mazeDiv.offset().top
        const width = this.mazeDiv.width()
        const height = this.mazeDiv.height() 
        let ctx = this.ctx
        ctx!.clearRect(0,0, this.canvas.width, this.canvas.height)
    }
    configInfoPanel() {
        const db = this
        this.infoPanel = {
            positions: {},
            getCanvas: function() {
                return db.canvas
            },
            x: 0,
            y: 0,
            line: 0,
            col: 0,
            messages: [],
            interval: null,
            info:{},
            update: function() {
               this.x =  db.mazeDiv.offset().left + db.mazeDiv.width()+20
               this.y =  db.mazeDiv.offset().top + db.mazeDiv.height()/2 - 100
            },
            log: function() {
                const _this = this
                window.clearInterval(this.interval)
                this.interval = window.setInterval(()=>{
                    const formater = new Intl.NumberFormat("en-US",{maximumFractionDigits:3})
                    const gridPosition = 
                        db.gc.pacman.characterUtil.determineGridPosition(
                            {x: db.gc.pacman.position.x,
                             y: db.gc.pacman.position.y} as ObservablePoint, 
                             db.tileSize,db.gc.pacman.anchor,
                            db.gc.scale)

                    const pacX = formater.format(gridPosition.x)
                    const pacY = formater.format(gridPosition.y)
                    _this.messages = ['Pacman position:', 'l:'+ pacY+',c:'+pacX]
                    _this.printMessage(0,0)

                    const direction = db.gc.pacman.direction
                    let items = _this.positions[direction]
                    let hasItem = false
                    if (!items)
                        items = []
                    for (let pos in _this.positions) {
                        if (pos != direction) {
                            delete _this.positions[pos]
                            continue
                        }
                        // for (let i = _this.positions[pos].length; i >=0; i--) {
                        //     const it = _this.positions[pos][i]
                        //     if (it.x == pacX && it.y == )
                        // }
                        hasItem = _this.positions[pos].filter((element: { x: string; y: string })=>{
                            return element.x == pacX && element.y == pacY
                        }).length > 0
                    }
                    if (!hasItem)
                        items.push({x: pacX, y: pacY})
                    _this.positions[direction] = items

                    localStorage.setItem(direction, JSON.stringify(items))
                }, 33)
            },
            printMessage: function(line: any, col: any) {
                this.line = line
                this.col = col
                this.update()
                const ctx = this.getCanvas().getContext('2d')
                ctx!.clearRect(this.x, this.y, 300, 500)
                ctx!.fillStyle = 'white'
                ctx!.font = db.tileSize +"px 'Press Start 2P', sans-serif"
                this.messages.forEach((message: any, index: number)=>{
                    ctx!.fillText(message, this.x, this.y+ +(index * db.tileSize))
                })
            },
            clearMessages: function() {
                this.messages = []
            }
        }
    }
    makePacmanImortal(isImmortal: boolean) {
        if (this.gc.allowPacmanMovement) {
            //@ts-ignore
            this.gc.pacman.immortal = isImmortal
            this.pacmanImmortal = isImmortal
            this.gc.pacman.allowCollision = !isImmortal
            // this.gc.ghosts.forEach(ghost => {
            //     ghost.allowCollision = !isImmortal
            // });
            if (isImmortal)
                console.info('Pacman is immortal!')
            else
                console.info('Pacman is mortal again.')
        }
    }
    drawEntities(isDraw: boolean) {
        this.gc.ghosts.forEach((ghost: { display: any })=>{
            ghost.display = isDraw
        })
    }

    moveEntities() {
        this.gc.pacman.moving = !this.gc.pacman.moving
        this.gc.ghosts.forEach((ghost: { moving: boolean })=>{
            ghost.moving = !ghost.moving
        })
    }
    startWave() {
        console.log("Key f pressed")
        //@ts-ignore 
        if (this.gc.mod.flood)  {
            //@ts-ignore
            this.gc.mod.flood.generateWave(0)
        }
        
    }
    drawBoundsAndHitBoxes(onlyMovableEntities:boolean) {        
        if (!this.enableBoundsAndHitBoxes)
            return
        const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D
        const mazePos = this.mazeDiv.position()
        ctx.save()
        ctx.translate(mazePos.left, mazePos.top)
        ctx.clearRect(0,0,this.mazeDiv.width(), this.mazeDiv.height())
        let list = this.gc.entityList
        if (onlyMovableEntities)
            list = list.filter(e=>e instanceof MovableEntity)
        list.forEach(e => {
            ctx.lineWidth = 2
            ctx.strokeStyle = "yellow"
            const b = e.getBounds()
            ctx.strokeRect(b.x, b.y, b.width, b.height)

            const h = e.hitArea as Rectangle
            ctx.lineWidth = 2
            ctx.strokeStyle = "red"
            ctx.strokeRect(h.x * this.scale, h.y * this.scale, 
                h.width * this.scale, h.height * this.scale)
        })
        //ctx.stroke()
        ctx.restore()       
    }    

    getImageData(texture:Texture) {
        const resource =  (texture.baseTexture.resource as CanvasResource)        
        const canvas = resource.source as ICanvas
        const context = canvas.getContext("2d") 
        const w = canvas.width, h = canvas.height;        
        const threshold = 255

        let imageData = context!.getImageData(0, 0, w, h);
        //create array
        let hitmap = new Uint32Array(Math.ceil(w * h / 32));
        //fill array
        for (let i = 0; i < w * h; i++) {
            //lower resolution to make it faster
            let ind1 = i % 32;
            let ind2 = i / 32 | 0;        
            //check every 4th value of image data (alpha number; opacity of the pixel)
            //if it's visible add to the array
            if (imageData.data[i * 4 + 3]! >= threshold) {
                hitmap[ind2] = hitmap[ind2]! | (1 << ind1);
                    console.log(`hitmap[${ind2}]:`, hitmap[ind2]);
            }
        }
    }
     //@ts-nocheck
    notifyPacmanMovement() {
        //@ts-ignore
        if (!this.gc.pacman['update']['changed']) {
            //@ts-ignore
            this.gc.pacman['update2'] = this.gc.pacman['update']

            const _this = this
            
            this.gc.pacman['update'] = function(elapsedMs: any) {
                //@ts-ignore
                this['update2'](elapsedMs)
                _this._notify2('update')
            }
            //@ts-ignore
            this.gc.pacman['update']['changed'] = true
        }
    }
    _notify(functionName: any) {
        const pacman = this.gc.pacman
        const gridPosition  = pacman.characterUtil.determineGridPosition(
            pacman.oldPosition,pacman.scaledTileSize,
            pacman.anchor, this.gc.scale
        )
        const newGridPosition  = pacman.characterUtil.determineGridPosition(
              pacman.position,pacman.scaledTileSize,
            pacman.anchor, this.gc.scale)    
        if (pacman.characterUtil.changingGridPosition(
            gridPosition, newGridPosition)) {
                const round = pacman.characterUtil.determineRoundingFunction(pacman.direction)
                 this.infoPanel.messages = [
                    'Pacman changed to tile (x,y:):',
                    round(newGridPosition.x) + ', '+round(newGridPosition.y)
                 ]
                 this.infoPanel.printMessage(0,0)
                 pacman.moving = false
            }
    } 

    _notify2(functionName: string) {
        const pacman = this.gc.pacman
        const infoPanel = this.infoPanel
        const handleUnsnappedMovement =  pacman.handleUnsnappedMovement
        const handleSnappedMovement =  pacman.handleSnappedMovement
        //@ts-ignore
        if (!pacman['handleSnappedMovement']['changed']) {
            //@ts-ignore
            pacman['handleSnappedMovement2'] = handleSnappedMovement
            pacman['handleSnappedMovement'] = function(elapsedMs: any) {
                infoPanel.messages.push('Pacman "handleSnappedMovement" called')
                //@ts-ignore
                return this['handleSnappedMovement2'](elapsedMs)
            }
            //@ts-ignore
            pacman['handleSnappedMovement']['changed'] = true
        }
        //@ts-ignore
        if (!pacman['handleUnsnappedMovement']['changed']) {
            //@ts-ignore
            pacman['handleUnsnappedMovement2'] = handleUnsnappedMovement
            pacman['handleUnsnappedMovement'] = function(gridPosition: any, elapsedMs: any) {
                infoPanel.messages.push('Pacman "handleUnsnappedMovement" called')
                //@ts-ignore
                return this['handleUnsnappedMovement2'](gridPosition, elapsedMs)
            }
            //@ts-ignore
            pacman['handleUnsnappedMovement']['changed'] = true
        }
        if (pacman.moving != infoPanel.info.moving) {
            if (!pacman.moving)
                infoPanel.messages.push('Pacman stopped')
        }
        if (pacman.direction != infoPanel.info.direction) {
            infoPanel.messages.push('Pacman change its direction')
            infoPanel.messages.forEach((message: string)=>{
                console.log(message)
            })
            infoPanel.clearMessages()
        }

        
        infoPanel.info.moving = pacman.moving
        infoPanel.info.desiredDirection = pacman.desiredDirection
        infoPanel.info.direction = pacman.direction
    }
}
//removeIf(production)
export default Debugger
//endRemoveIf