"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mod_js_1 = __importDefault(require("../mod.js"));
const flood_js_1 = __importDefault(require("./mods/flood/app/scripts/core/flood.js"));
class FloodModImp extends mod_js_1.default {
    flood;
    constructor(gameCoodinator) {
        super(gameCoodinator);
        this.flood = new flood_js_1.default(gameCoodinator);
    }
    initialize() {
        this.flood.initialize();
    }
    reset() {
        this.flood.reset();
    }
    start() {
        this.flood.start();
    }
    stop() {
        this.flood.stop();
    }
    pause() {
        this.flood.pause();
    }
    update(elapsedMs) {
        super.update(elapsedMs);
        this.flood.update(elapsedMs);
    }
    draw() {
        super.draw();
        this.flood.draw();
    }
}
// if (!process.env.NYC_PROCESS_ID) 
//   global.window.FloodModImp = FloodModImp
//removeIf(production)
exports.default = FloodModImp;
//endRemoveIf