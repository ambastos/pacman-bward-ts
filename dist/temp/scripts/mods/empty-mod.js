"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mod_js_1 = __importDefault(require("./mod.js"));
class EmptyMod extends mod_js_1.default {
    constructor(gameCoordinator) {
        super(gameCoordinator);
    }
}
exports.default = EmptyMod;