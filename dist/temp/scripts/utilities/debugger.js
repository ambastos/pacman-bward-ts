"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Debugger {
    gc;
    overflowMask;
    mazeDiv;
    mazeArray;
    tileSize;
    pacmanImmortal;
    printMazeGrid;
    infoPanel;
    canvas;
    shouldPrintGrid;
    printing;
    constructor(gameCoordinator) {
        this.gc = gameCoordinator;
        this.overflowMask = $("#overflow-mask");
        this.mazeDiv = $(this.gc.mazeDiv);
        this.mazeArray = this.gc.mazeArray;
        this.tileSize = this.gc.scaledTileSize;
        this.pacmanImmortal = false;
        this.printMazeGrid = false;
        this.createCanvas();
        this.handleInput();
        this.configInfoPanel();
        window.debug = this;
    }
    handleInput() {
        const dbg = this;
        window.addEventListener('keydown', (event) => {
            if (event.key == '3')
                dbg.makePacmanImortal(true);
            else if (event.key == '4')
                dbg.makePacmanImortal(false);
            else if (event.key == '1')
                dbg.mazeGrid(true);
            else if (event.key == '2')
                dbg.mazeGrid(false);
            else if (event.key == '5')
                dbg.infoPanel.log();
            else if (event.key == '7')
                dbg.drawEntities(false);
            else if (event.key == '8')
                dbg.drawEntities(true);
            else if (event.key == ',') //<
                dbg.moveInUnits('left', 1);
            else if (event.key == '.') //> 
                dbg.moveInUnits('right', 1);
            else if (event.key == ' ') //> 
                dbg.moveEntities();
            else if (event.key == 'u')
                dbg.notifyPacmanMovement();
            else if (event.key.toLowerCase() == 'f')
                dbg.startWave();
            // if (event.key !=  'HanjaMode') {
            //     alert(event.key)
            // }
        });
    }
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'canvasD';
        document.body.append(this.canvas);
        const canvas = $(this.canvas);
        const mazeDiv = $(this.gc.mazeDiv);
        canvas.css('position', 'absolute');
        canvas.css('left', 0);
        canvas.css('top', 0);
        canvas.width(this.overflowMask.width());
        canvas.height(this.overflowMask.height());
        this.canvas.width = this.overflowMask.width();
        this.canvas.height = this.overflowMask.height();
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
    moveInUnits(direction, units) {
        const elapsedMs = this.gc.gameEngine.elapsedMs;
        let position = this.gc.pacman.position;
        const velocityPerMs = this.gc.pacman.velocityPerMs;
        let newPositions;
        for (let i = 0; i < units; i++) {
            newPositions = this.gc.pacman.characterUtil.determineNewPositions(position, direction, velocityPerMs, elapsedMs, this.gc.pacman.scaledTileSize);
            position = newPositions.newPosition;
        }
        this.gc.pacman.position = position;
    }
    mazeGrid(printGrid) {
        const fc = this.gc.gameEngine.update;
        const _this = this;
        this.shouldPrintGrid = printGrid;
        if (_this.printing)
            return;
        const interval = window.setInterval(() => {
            _this.printing = true;
            if (_this.shouldPrintGrid) {
                _this.printGrid();
            }
            else {
                _this.printing = false;
                _this.clearGrid();
                window.clearInterval(interval);
            }
        }, 25);
    }
    printGrid() {
        const mazeX = this.mazeDiv.offset().left;
        const mazeY = this.mazeDiv.offset().top;
        const width = this.mazeDiv.width();
        const height = this.mazeDiv.height();
        let ctx = this.canvas.getContext("2d");
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 1;
        let x = mazeX, y = mazeY;
        ctx.clearRect(mazeX, mazeY, width, height);
        ctx.beginPath();
        ctx.moveTo(mazeX, mazeY);
        this.mazeArray.forEach((row, rowIndex) => {
            if (rowIndex > 0) {
                x = mazeX;
                y += this.tileSize;
            }
            ctx.moveTo(x, y);
            ctx.lineTo(width + mazeX, y);
            row.forEach((col, colIndex) => {
                //ctx!.strokeRect(x,y, this.tileSize, this.tileSize) 
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + this.tileSize);
                x += this.tileSize;
                if (colIndex == this.mazeArray[rowIndex].length - 1) {
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y + this.tileSize);
                }
            });
            if (rowIndex == this.mazeArray.length - 1) {
                y += this.tileSize;
                ctx.moveTo(mazeX, y);
                ctx.lineTo(width + mazeX, y);
            }
        });
        ctx.stroke();
        ctx.strokeStyle = 'yellow';
        const pacX = this.gc.pacman.position.left + mazeX;
        const pacY = this.gc.pacman.position.top + mazeY;
        ctx.strokeRect(pacX, pacY, this.tileSize * 2, this.tileSize * 2);
        ctx.strokeStyle = 'red';
        ctx.strokeRect(pacX, pacY, this.tileSize, this.tileSize);
    }
    clearGrid() {
        const mazeX = this.mazeDiv.offset().left;
        const mazeY = this.mazeDiv.offset().top;
        const width = this.mazeDiv.width();
        const height = this.mazeDiv.height();
        let ctx = this.canvas.getContext("2d");
        ctx.clearRect(mazeX - 1, mazeY - 1, width + 2, height + 2);
    }
    configInfoPanel() {
        const db = this;
        this.infoPanel = {
            positions: {},
            getCanvas: function () {
                return db.canvas;
            },
            x: 0,
            y: 0,
            line: 0,
            col: 0,
            messages: [],
            interval: null,
            info: {},
            update: function () {
                this.x = db.mazeDiv.offset().left + db.mazeDiv.width() + 20;
                this.y = db.mazeDiv.offset().top + db.mazeDiv.height() / 2 - 100;
            },
            log: function () {
                const _this = this;
                window.clearInterval(this.interval);
                this.interval = window.setInterval(() => {
                    const formater = new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 });
                    const gridPosition = db.gc.pacman.characterUtil.determineGridPosition({ left: db.gc.pacman.position.left,
                        top: db.gc.pacman.position.top }, db.tileSize);
                    const pacX = formater.format(gridPosition.x);
                    const pacY = formater.format(gridPosition.y);
                    _this.messages = ['Pacman position:', 'l:' + pacY + ',c:' + pacX];
                    _this.printMessage(0, 0);
                    const direction = db.gc.pacman.direction;
                    let items = _this.positions[direction];
                    let hasItem = false;
                    if (!items)
                        items = [];
                    for (let pos in _this.positions) {
                        if (pos != direction) {
                            delete _this.positions[pos];
                            continue;
                        }
                        // for (let i = _this.positions[pos].length; i >=0; i--) {
                        //     const it = _this.positions[pos][i]
                        //     if (it.x == pacX && it.y == )
                        // }
                        hasItem = _this.positions[pos].filter((element) => {
                            return element.x == pacX && element.y == pacY;
                        }).length > 0;
                    }
                    if (!hasItem)
                        items.push({ x: pacX, y: pacY });
                    _this.positions[direction] = items;
                    localStorage.setItem(direction, JSON.stringify(items));
                }, 33);
            },
            printMessage: function (line, col) {
                this.line = line;
                this.col = col;
                this.update();
                const ctx = this.getCanvas().getContext('2d');
                ctx.clearRect(this.x, this.y, 300, 500);
                ctx.fillStyle = 'white';
                ctx.font = db.tileSize + "px 'Press Start 2P', sans-serif";
                this.messages.forEach((message, index) => {
                    ctx.fillText(message, this.x, this.y + +(index * db.tileSize));
                });
            },
            clearMessages: function () {
                this.messages = [];
            }
        };
    }
    makePacmanImortal(isImmortal) {
        if (this.gc.allowPacmanMovement) {
            this.gc.pacman.immortal = isImmortal;
            this.pacmanImmortal = isImmortal;
            this.gc.pacman.allowCollision = !isImmortal;
            // this.gc.ghosts.forEach(ghost => {
            //     ghost.allowCollision = !isImmortal
            // });
            if (isImmortal)
                console.info('Pacman is immortal!');
            else
                console.info('Pacman is mortal again.');
        }
    }
    drawEntities(isDraw) {
        this.gc.ghosts.forEach((ghost) => {
            ghost.display = isDraw;
        });
    }
    moveEntities() {
        this.gc.pacman.moving = !this.gc.pacman.moving;
        this.gc.ghosts.forEach((ghost) => {
            ghost.moving = !ghost.moving;
        });
    }
    notifyPacmanMovement() {
        const fc = this.gc.pacman['update'];
        if (!this.gc.pacman['update']['changed']) {
            this.gc.pacman['update2'] = this.gc.pacman['update'];
            const _this = this;
            this.gc.pacman['update'] = function (elapsedMs) {
                this['update2'](elapsedMs);
                _this._notify2('update');
            };
            this.gc.pacman['update']['changed'] = true;
        }
    }
    startWave() {
        console.log("Key f pressed");
        if (this.gc.mod.flood) {
            this.gc.mod.flood.generateWave(0);
        }
    }
    _notify(functionName) {
        const pacman = this.gc.pacman;
        const gridPosition = pacman.characterUtil.determineGridPosition(pacman.oldPosition, pacman.scaledTileSize);
        const newGridPosition = pacman.characterUtil.determineGridPosition(pacman.position, pacman.scaledTileSize);
        if (pacman.characterUtil.changingGridPosition(gridPosition, newGridPosition)) {
            const round = pacman.characterUtil.determineRoundingFunction(pacman.direction);
            this.infoPanel.messages = [
                'Pacman changed to tile (x,y:):',
                round(newGridPosition.x) + ', ' + round(newGridPosition.y)
            ];
            this.infoPanel.printMessage(0, 0);
            pacman.moving = false;
        }
    }
    _notify2(functionName) {
        const pacman = this.gc.pacman;
        const infoPanel = this.infoPanel;
        const handleUnsnappedMovement = pacman.handleUnsnappedMovement;
        const handleSnappedMovement = pacman.handleSnappedMovement;
        if (!pacman['handleSnappedMovement']['changed']) {
            pacman['handleSnappedMovement2'] = handleSnappedMovement;
            pacman['handleSnappedMovement'] = function (elapsedMs) {
                infoPanel.messages.push('Pacman "handleSnappedMovement" called');
                return this['handleSnappedMovement2'](elapsedMs);
            };
            pacman['handleSnappedMovement']['changed'] = true;
        }
        if (!pacman['handleUnsnappedMovement']['changed']) {
            pacman['handleUnsnappedMovement2'] = handleUnsnappedMovement;
            pacman['handleUnsnappedMovement'] = function (gridPosition, elapsedMs) {
                infoPanel.messages.push('Pacman "handleUnsnappedMovement" called');
                return this['handleUnsnappedMovement2'](gridPosition, elapsedMs);
            };
            pacman['handleUnsnappedMovement']['changed'] = true;
        }
        if (pacman.moving != infoPanel.info.moving) {
            if (!pacman.moving)
                infoPanel.messages.push('Pacman stopped');
        }
        if (pacman.direction != infoPanel.info.direction) {
            infoPanel.messages.push('Pacman change its direction');
            infoPanel.messages.forEach((message) => {
                console.log(message);
            });
            infoPanel.clearMessages();
        }
        infoPanel.info.moving = pacman.moving;
        infoPanel.info.desiredDirection = pacman.desiredDirection;
        infoPanel.info.direction = pacman.direction;
    }
}
// if (!process.env.NYC_PROCESS_ID) 
//     global.window.Debugger = Debugger
//removeIf(production)
exports.default = Debugger;
//endRemoveIf