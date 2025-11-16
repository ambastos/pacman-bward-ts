"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pixi_js_1 = require("pixi.js");
const idleState_js_1 = __importDefault(require("../states/idleState.js"));
const startState_js_1 = __importDefault(require("../states/startState.js"));
const endState_js_1 = __importDefault(require("../states/endState.js"));
const cancelState_js_1 = __importDefault(require("../states/cancelState.js"));
const drownManager_js_1 = __importDefault(require("./drownManager.js"));
const mod_js_1 = __importDefault(require("../mod.js"));
const state_js_1 = require("../states/state.js");
/** name spacing used to create the needed properties*/
const breathNamespace = "breath";
class Flood extends mod_js_1.default {
    width;
    maxHeight;
    tileSize;
    container;
    nextWaveTime;
    gp;
    drownManager;
    pacman;
    ghosts;
    states;
    state;
    constructor(gameCoordinator) {
        super(gameCoordinator);
        this.width = gameCoordinator.width;
        this.maxHeight = gameCoordinator.height;
        this.tileSize = this.gc.tileSize;
        this.container = new pixi_js_1.Container();
        this.nextWaveTime = null;
        this.gp = new pixi_js_1.Graphics();
        this.drownManager = new drownManager_js_1.default(this);
    }
    async initialize() {
        this.pacman = this.gc.pacman;
        this.gc.lives = 10;
        console.log("lives for debugging ", this.gc.lives);
        this.ghosts = this.gc.ghosts;
        this.drownManager.initialize();
        this.states = [new idleState_js_1.default(this.drownManager), new startState_js_1.default(this.drownManager),
            new endState_js_1.default(this.drownManager), new cancelState_js_1.default(this.drownManager)
        ];
        //@ts-ignore
        this.state = this.states[state_js_1.States.IDLE_STATE];
        //Assets.add({alias:"bubbles", src: "../../sprites/bubbles.png"})
        //await Assets.load(["bubbles"])
        this.#registerListeners();
    }
    #registerListeners() {
        this.emitter = this.gc.emitter;
        this.emitter.on("game-over", () => {
            this.stop();
        });
        this.#changePacmanDeathSequence();
    }
    #changePacmanDeathSequence() {
        this.gc.emitter.removeAllListeners("pacman-death");
        const _this = this;
        this.gc.emitter.on("pacman-death", () => {
            const wave = _this.drownManager.wave;
            if (wave && wave.started) {
                const detail = {
                    detail: {
                        restart: false,
                        callbackAfter: () => {
                            _this.changeState(state_js_1.States.CANCEL_STATE);
                        }
                    }
                };
                //@ts-ignore
                this.gc.deathSequence(detail);
            }
            else {
                this.pacman.onDeath();
            }
        });
    }
    changeState(state) {
        this.state.stop();
        //@ts-ignore
        this.state = this.states[state];
        this.state.start();
    }
    start() {
        super.start();
        this.pacman = this.gc.pacman;
        this.ghosts = this.gc.ghosts;
        this.gc.stage.removeChild(this.container);
        this.gc.stage.addChild(this.container);
        //Gp is the graphics to draw
        this.container.removeChild(this.gp);
        this.container.addChild(this.gp);
        //@ts-ignore
        this.state = this.states[state_js_1.States.IDLE_STATE];
        this.state.start();
    }
    stop() {
        super.stop();
        this.drownManager.stop();
    }
    generateWave(timeToStartMS) {
        this.changeState(state_js_1.States.IDLE_STATE);
        this.state.generateWave(timeToStartMS);
    }
    reset() {
    }
    update(elapsedMs) {
        if (!this.started)
            return;
        this.drownManager.update(elapsedMs);
        this.state.update(elapsedMs);
        if (!(this.state instanceof cancelState_js_1.default)) {
            //start to drown Pacman
            this.drownManager.tryDrownEntities(elapsedMs);
        }
        // }
    }
    draw() {
        if (!this.started)
            return;
        if (this.drownManager?.wave) {
            this.drownManager.wave.draw();
        }
    }
}
//removeIf(production)
exports.default = Flood;
//endRemoveIf