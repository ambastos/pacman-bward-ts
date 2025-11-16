"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ghost_js_1 = __importDefault(require("../../../../../../../characters/ghost.js"));
const pacman_js_1 = __importDefault(require("../../../../../../../characters/pacman.js"));
const animator_js_1 = __importDefault(require("../animations/animator.js"));
const state_js_1 = require("../states/state.js");
const breath_js_1 = __importDefault(require("./breath.js"));
const util_js_1 = require("../utils/util.js");
/** name spacing used to create the needed properties*/
const breathNamespace = "breath";
class DrownManager {
    wave;
    waveTime = null;
    nextWaveTime = null;
    maxHeight;
    gc;
    animator;
    flood;
    gp;
    container;
    pacman;
    ghosts;
    emitter;
    constructor(flood) {
        this.flood = flood;
        this.maxHeight = flood.maxHeight;
        this.gc = flood.gc;
        this.gp = flood.gp;
        this.gc.ghostCombo = 0;
        this.animator = new animator_js_1.default(this);
        this.container = flood.container;
    }
    initialize() {
        this.gc = this.flood.gc;
        this.pacman = this.flood.gc.pacman;
        this.ghosts = this.flood.gc.ghosts;
        this.emitter = this.gc.emitter;
        this.createBreath(this.pacman, {
            breathing: 5,
            maxBreathing: 10,
            decreaseVelocityPerMs: 0.8,
        });
        this.ghosts.forEach(g => {
            this.createBreath(g);
        });
        this.animator.createAnimation("breath", 200, null, (args) => {
            const pacman = args.entity;
            //console.log("animation", args)
        });
    }
    createBreath(entity, options) {
        //@ts-ignore            
        entity[breathNamespace] = new breath_js_1.default(options);
    }
    resetEntitiesBreathing() {
        this.resetEntity(this.pacman);
        this.ghosts.forEach(ghost => {
            this.resetEntity(ghost);
        });
    }
    resetEntity(entity) {
        entity[breathNamespace].reset();
    }
    stopDrown(entity) {
        entity[breathNamespace].stopped = true;
    }
    tryDrownEntities(elapsedMs) {
        this.#tryDrownEntity(this.pacman, elapsedMs);
        this.ghosts.forEach(ghost => {
            this.#tryDrownEntity(ghost, elapsedMs);
        });
    }
    #tryDrownEntity(entity, elapsedMs) {
        const breath = entity[breathNamespace];
        const wave = this?.wave;
        if (!wave || !wave.started || breath.stopped)
            return;
        const sprite = entity.sprite.getBounds();
        let isInGhostHouse = false;
        if (entity instanceof ghost_js_1.default) {
            isInGhostHouse = entity.isInGhostHouse(entity.getGridPosition());
        }
        const isInsideTheWave = wave.getBounds().contains(sprite.x, sprite.y);
        if (entity.allowCollision && !isInGhostHouse && isInsideTheWave) {
            breath.elapsedTimeLastBreathMs += elapsedMs;
            if (breath.elapsedTimeLastBreathMs >= 1000) {
                breath.elapsedTimeLastBreathMs = 0;
                breath.breathing -= 1;
                if (breath.breathing <= 0) {
                    breath.breathing = 0;
                    this.killEntity(entity);
                }
            }
        }
        else {
            breath.elapsedTimeLastBreathMs += elapsedMs;
            if (breath.elapsedTimeLastBreathMs >= 300) {
                breath.breathing += 1;
                breath.elapsedTimeLastBreathMs = 0;
                if (breath.breathing >= breath.defaultBreathing)
                    breath.breathing = breath.defaultBreathing;
            }
        }
    }
    killEntity(entity) {
        const breath = entity[breathNamespace];
        if (entity instanceof pacman_js_1.default) {
            // window.dispatchEvent(new Event('deathSequence'));
            this.emitter.emit("pacman-death");
            breath.stop();
            breath.reset();
            //this.terminateWave()
            this.flood.changeState(state_js_1.States.END_STATE);
        }
        else if (entity instanceof ghost_js_1.default) {
            const event = { ghost: entity };
            //this.emitter.emit(`ghost-eaten-${entity.name}`,event)
            const pauseDuration = 1000;
            const { position, measurement } = entity;
            entity.mode = 'eyes';
            this.gc.eyeGhosts += 1;
            this.gc.ghostCombo += 1;
            const comboPoints = this.gc.determineComboPoints();
            this.emitter.emit("award-points", { detail: { points: comboPoints } });
            this.gc.displayText(position, comboPoints, pauseDuration, measurement);
            breath.stop();
            breath.reset();
            if (this.gc.ghostCombo > this.gc.ghosts.length) {
                this.gc.eyeGhosts = 0;
                this.gc.ghostCombo = 0;
            }
        }
        //console.log(entity.constructor.name, " is drowned!")
    }
    showBreathingStatus(entity) {
        const { position, measurement } = entity;
        //@ts-ignore
        const text = `Breathing ${entity[breathNamespace].breathing}`;
        this.gc.displayText(position, text, 5000, measurement);
    }
    clear() {
        if (this.wave) {
            this.gp.clear();
            this.gc.stage.removeChild(this.wave);
            this.container.children.length = 0;
        }
    }
    stop() {
        this.clear();
        this.wave = null;
        this.waveTime = null;
        this.nextWaveTime = null;
        this.gc.ghostCombo = 0;
    }
    update(elapsedMs) {
        if (this.wave) {
            this.animator.update();
            const container = this.container;
            const bubbles = container.children.filter((f) => {
                return f.name == 'buble';
            });
            const pacman = this.gc.pacman;
            //@ts-ignore
            const hitArea = (0, util_js_1.enlarge)(pacman.sprite.hitArea.clone(), 2);
            bubbles.forEach((b) => {
                if (b.getBounds().contains(hitArea.x, hitArea.y)) {
                    container.removeChild(b);
                    //@ts-ignore
                    pacman[breathNamespace].breathing = pacman[breathNamespace].maxBreathing;
                    this.showBreathingStatus(pacman);
                    //console.log("play breath")
                    //this.animator.play("breath", {entity: pacman})
                }
            });
        }
    }
}
exports.default = DrownManager;