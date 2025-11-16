"use strict";
// import GameCoordinator from "./core/gameCoordinator.js";
// import Debugger from "./utilities/debugger.js";
// import FloodModImp from "../mods/implementations/flood-mod-imp.js";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gameCoordinator_js_1 = __importDefault(require("./core/gameCoordinator.js"));
const flood_mod_imp_js_1 = __importDefault(require("./mods/implementations/flood-mod-imp.js"));
const debugger_js_1 = __importDefault(require("./utilities/debugger.js"));
window.onload = () => {
    window.gc = new gameCoordinator_js_1.default();
    const mod = new flood_mod_imp_js_1.default(window.gc);
    window.gc.setMod(mod);
    window.debug = new debugger_js_1.default(window.gc);
};