"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enlarge = enlarge;
/**
 *
 * @param {Rectangle} rectangle
 * @param {Number} times
 */
function enlarge(rectangle, times = 1) {
    rectangle.x = rectangle.x * times;
    rectangle.y = rectangle.y * times;
    rectangle.width = rectangle.width * times;
    rectangle.height = rectangle.height * times;
    return rectangle;
}