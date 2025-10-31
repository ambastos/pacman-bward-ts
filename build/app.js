(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (process,global){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var Ghost = /*#__PURE__*/function () {
  function Ghost(scaledTileSize, mazeArray, pacman, name, level, characterUtil, blinky) {
    _classCallCheck(this, Ghost);
    this.scaledTileSize = scaledTileSize;
    this.mazeArray = mazeArray;
    this.pacman = pacman;
    this.name = name;
    this.level = level;
    this.characterUtil = characterUtil;
    this.blinky = blinky;
    this.animationTarget = document.getElementById(name);
    this.reset();
  }

  /**
   * Rests the character to its default state
   * @param {Boolean} fullGameReset
   */
  return _createClass(Ghost, [{
    key: "reset",
    value: function reset(fullGameReset) {
      if (fullGameReset) {
        delete this.defaultSpeed;
        delete this.cruiseElroy;
      }
      this.setDefaultMode();
      this.setMovementStats(this.pacman, this.name, this.level);
      this.setSpriteAnimationStats();
      this.setStyleMeasurements(this.scaledTileSize, this.spriteFrames);
      this.setDefaultPosition(this.scaledTileSize, this.name);
      this.setSpriteSheet(this.name, this.direction, this.mode);
    }

    /**
     * Sets the default mode and idleMode behavior
     */
  }, {
    key: "setDefaultMode",
    value: function setDefaultMode() {
      this.allowCollision = true;
      this.defaultMode = 'scatter';
      this.mode = 'scatter';
      if (this.name !== 'blinky') {
        this.idleMode = 'idle';
      }
    }

    /**
     * Sets various properties related to the ghost's movement
     * @param {Object} pacman - Pacman's speed is used as the base for the ghosts' speeds
     * @param {('inky'|'blinky'|'pinky'|'clyde')} name - The name of the current ghost
     */
  }, {
    key: "setMovementStats",
    value: function setMovementStats(pacman, name, level) {
      var pacmanSpeed = pacman.velocityPerMs;
      var levelAdjustment = level / 100;
      this.slowSpeed = pacmanSpeed * (0.75 + levelAdjustment);
      this.mediumSpeed = pacmanSpeed * (0.875 + levelAdjustment);
      this.fastSpeed = pacmanSpeed * (1 + levelAdjustment);
      if (!this.defaultSpeed) {
        this.defaultSpeed = this.slowSpeed;
      }
      this.scaredSpeed = pacmanSpeed * 0.5;
      this.transitionSpeed = pacmanSpeed * 0.4;
      this.eyeSpeed = pacmanSpeed * 2;
      this.velocityPerMs = this.defaultSpeed;
      this.moving = false;
      switch (name) {
        case 'blinky':
          this.defaultDirection = this.characterUtil.directions.left;
          break;
        case 'pinky':
          this.defaultDirection = this.characterUtil.directions.down;
          break;
        case 'inky':
          this.defaultDirection = this.characterUtil.directions.up;
          break;
        case 'clyde':
          this.defaultDirection = this.characterUtil.directions.up;
          break;
        default:
          this.defaultDirection = this.characterUtil.directions.left;
          break;
      }
      this.direction = this.defaultDirection;
    }

    /**
     * Sets values pertaining to the ghost's spritesheet animation
     */
  }, {
    key: "setSpriteAnimationStats",
    value: function setSpriteAnimationStats() {
      this.display = true;
      this.loopAnimation = true;
      this.animate = true;
      this.msBetweenSprites = 250;
      this.msSinceLastSprite = 0;
      this.spriteFrames = 2;
      this.backgroundOffsetPixels = 0;
      this.animationTarget.style.backgroundPosition = '0px 0px';
    }

    /**
     * Sets css property values for the ghost
     * @param {number} scaledTileSize - The dimensions of a single tile
     * @param {number} spriteFrames - The number of frames in the ghost's spritesheet
     */
  }, {
    key: "setStyleMeasurements",
    value: function setStyleMeasurements(scaledTileSize, spriteFrames) {
      // The ghosts are the size of 2x2 game tiles.
      this.measurement = scaledTileSize * 2;
      this.animationTarget.style.height = "".concat(this.measurement, "px");
      this.animationTarget.style.width = "".concat(this.measurement, "px");
      var bgSize = this.measurement * spriteFrames;
      this.animationTarget.style.backgroundSize = "".concat(bgSize, "px");
    }

    /**
     * Sets the default position and direction for the ghosts at the game's start
     * @param {number} scaledTileSize - The dimensions of a single tile
     * @param {('inky'|'blinky'|'pinky'|'clyde')} name - The name of the current ghost
     */
  }, {
    key: "setDefaultPosition",
    value: function setDefaultPosition(scaledTileSize, name) {
      switch (name) {
        case 'blinky':
          this.defaultPosition = {
            top: scaledTileSize * 10.5,
            left: scaledTileSize * 13
          };
          break;
        case 'pinky':
          this.defaultPosition = {
            top: scaledTileSize * 13.5,
            left: scaledTileSize * 13
          };
          break;
        case 'inky':
          this.defaultPosition = {
            top: scaledTileSize * 13.5,
            left: scaledTileSize * 11
          };
          break;
        case 'clyde':
          this.defaultPosition = {
            top: scaledTileSize * 13.5,
            left: scaledTileSize * 15
          };
          break;
        default:
          this.defaultPosition = {
            top: 0,
            left: 0
          };
          break;
      }
      this.position = Object.assign({}, this.defaultPosition);
      this.oldPosition = Object.assign({}, this.position);
      this.animationTarget.style.top = "".concat(this.position.top, "px");
      this.animationTarget.style.left = "".concat(this.position.left, "px");
    }

    /**
     * Chooses a movement Spritesheet depending upon direction
     * @param {('inky'|'blinky'|'pinky'|'clyde')} name - The name of the current ghost
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     */
  }, {
    key: "setSpriteSheet",
    value: function setSpriteSheet(name, direction, mode) {
      var emotion = '';
      if (this.defaultSpeed !== this.slowSpeed) {
        emotion = this.defaultSpeed === this.mediumSpeed ? '_annoyed' : '_angry';
      }
      if (mode === 'scared') {
        this.animationTarget.style.backgroundImage = 'url(app/style/graphics/' + "spriteSheets/characters/ghosts/scared_".concat(this.scaredColor, ".svg)");
      } else if (mode === 'eyes') {
        this.animationTarget.style.backgroundImage = 'url(app/style/graphics/' + "spriteSheets/characters/ghosts/eyes_".concat(direction, ".svg)");
      } else {
        this.animationTarget.style.backgroundImage = 'url(app/style/graphics/' + "spriteSheets/characters/ghosts/".concat(name, "/").concat(name, "_").concat(direction) + "".concat(emotion, ".svg)");
      }
    }

    /**
     * Checks to see if the ghost is currently in the 'tunnels' on the outer edges of the maze
     * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
     * @returns {Boolean}
     */
  }, {
    key: "isInTunnel",
    value: function isInTunnel(gridPosition) {
      return gridPosition.y === 14 && (gridPosition.x < 6 || gridPosition.x > 21);
    }

    /**
     * Checks to see if the ghost is currently in the 'Ghost House' in the center of the maze
     * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
     * @returns {Boolean}
     */
  }, {
    key: "isInGhostHouse",
    value: function isInGhostHouse(gridPosition) {
      return gridPosition.x > 9 && gridPosition.x < 18 && gridPosition.y > 11 && gridPosition.y < 17;
    }

    /**
     * Checks to see if the tile at the given coordinates of the Maze is an open position
     * @param {Array} mazeArray - 2D array representing the game board
     * @param {number} y - The target row
     * @param {number} x - The target column
     * @returns {(false | { x: number, y: number})} - x-y pair if the tile is free, false otherwise
     */
  }, {
    key: "getTile",
    value: function getTile(mazeArray, y, x) {
      var tile = false;
      if (mazeArray[y] && mazeArray[y][x] && mazeArray[y][x] !== 'X') {
        tile = {
          x: x,
          y: y
        };
      }
      return tile;
    }

    /**
     * Returns a list of all of the possible moves for the ghost to make on the next turn
     * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {Array} mazeArray - 2D array representing the game board
     * @returns {object}
     */
  }, {
    key: "determinePossibleMoves",
    value: function determinePossibleMoves(gridPosition, direction, mazeArray) {
      var x = gridPosition.x,
        y = gridPosition.y;
      var possibleMoves = {
        up: this.getTile(mazeArray, y - 1, x),
        down: this.getTile(mazeArray, y + 1, x),
        left: this.getTile(mazeArray, y, x - 1),
        right: this.getTile(mazeArray, y, x + 1)
      };

      // Ghosts are not allowed to turn around at crossroads
      possibleMoves[this.characterUtil.getOppositeDirection(direction)] = false;
      Object.keys(possibleMoves).forEach(function (tile) {
        if (possibleMoves[tile] === false) {
          delete possibleMoves[tile];
        }
      });
      return possibleMoves;
    }

    /**
     * Uses the Pythagorean Theorem to measure the distance between a given postion and Pacman
     * @param {({x: number, y: number})} position - An x-y position on the 2D Maze Array
     * @param {({x: number, y: number})} pacman - Pacman's current x-y position on the 2D Maze Array
     * @returns {number}
     */
  }, {
    key: "calculateDistance",
    value: function calculateDistance(position, pacman) {
      return Math.sqrt(Math.pow(position.x - pacman.x, 2) + Math.pow(position.y - pacman.y, 2));
    }

    /**
     * Gets a position a number of spaces in front of Pacman's direction
     * @param {({x: number, y: number})} pacmanGridPosition
     * @param {number} spaces
     */
  }, {
    key: "getPositionInFrontOfPacman",
    value: function getPositionInFrontOfPacman(pacmanGridPosition, spaces) {
      var target = Object.assign({}, pacmanGridPosition);
      var pacDirection = this.pacman.direction;
      var propToChange = pacDirection === 'up' || pacDirection === 'down' ? 'y' : 'x';
      var tileOffset = pacDirection === 'up' || pacDirection === 'left' ? spaces * -1 : spaces;
      target[propToChange] += tileOffset;
      return target;
    }

    /**
     * Determines Pinky's target, which is four tiles in front of Pacman's direction
     * @param {({x: number, y: number})} pacmanGridPosition
     * @returns {({x: number, y: number})}
     */
  }, {
    key: "determinePinkyTarget",
    value: function determinePinkyTarget(pacmanGridPosition) {
      return this.getPositionInFrontOfPacman(pacmanGridPosition, 4);
    }

    /**
     * Determines Inky's target, which is a mirror image of Blinky's position
     * reflected across a point two tiles in front of Pacman's direction.
     * Example @ app\style\graphics\spriteSheets\references\inky_target.png
     * @param {({x: number, y: number})} pacmanGridPosition
     * @returns {({x: number, y: number})}
     */
  }, {
    key: "determineInkyTarget",
    value: function determineInkyTarget(pacmanGridPosition) {
      var blinkyGridPosition = this.characterUtil.determineGridPosition(this.blinky.position, this.scaledTileSize);
      var pivotPoint = this.getPositionInFrontOfPacman(pacmanGridPosition, 2);
      return {
        x: pivotPoint.x + (pivotPoint.x - blinkyGridPosition.x),
        y: pivotPoint.y + (pivotPoint.y - blinkyGridPosition.y)
      };
    }

    /**
     * Clyde targets Pacman when the two are far apart, but retreats to the
     * lower-left corner when the two are within eight tiles of each other
     * @param {({x: number, y: number})} gridPosition
     * @param {({x: number, y: number})} pacmanGridPosition
     * @returns {({x: number, y: number})}
     */
  }, {
    key: "determineClydeTarget",
    value: function determineClydeTarget(gridPosition, pacmanGridPosition) {
      var distance = this.calculateDistance(gridPosition, pacmanGridPosition);
      return distance > 8 ? pacmanGridPosition : {
        x: 0,
        y: 30
      };
    }

    /**
     * Determines the appropriate target for the ghost's AI
     * @param {('inky'|'blinky'|'pinky'|'clyde')} name - The name of the current ghost
     * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
     * @param {({x: number, y: number})} pacmanGridPosition - x-y position on the 2D Maze Array
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     * @returns {({x: number, y: number})}
     */
  }, {
    key: "getTarget",
    value: function getTarget(name, gridPosition, pacmanGridPosition, mode) {
      // Ghosts return to the ghost-house after eaten
      if (mode === 'eyes') {
        return {
          x: 13.5,
          y: 10
        };
      }

      // Ghosts run from Pacman if scared
      if (mode === 'scared') {
        return pacmanGridPosition;
      }

      // Ghosts seek out corners in Scatter mode
      if (mode === 'scatter') {
        switch (name) {
          case 'blinky':
            // Blinky will chase Pacman, even in Scatter mode, if he's in Cruise Elroy form
            return this.cruiseElroy ? pacmanGridPosition : {
              x: 27,
              y: 0
            };
          case 'pinky':
            return {
              x: 0,
              y: 0
            };
          case 'inky':
            return {
              x: 27,
              y: 30
            };
          case 'clyde':
            return {
              x: 0,
              y: 30
            };
          default:
            return {
              x: 0,
              y: 0
            };
        }
      }
      switch (name) {
        // Blinky goes after Pacman's position
        case 'blinky':
          return pacmanGridPosition;
        case 'pinky':
          return this.determinePinkyTarget(pacmanGridPosition);
        case 'inky':
          return this.determineInkyTarget(pacmanGridPosition);
        case 'clyde':
          return this.determineClydeTarget(gridPosition, pacmanGridPosition);
        default:
          // TODO: Other ghosts
          return pacmanGridPosition;
      }
    }

    /**
     * Calls the appropriate function to determine the best move depending on the ghost's name
     * @param {('inky'|'blinky'|'pinky'|'clyde')} name - The name of the current ghost
     * @param {Object} possibleMoves - All of the moves the ghost could choose to make this turn
     * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
     * @param {({x: number, y: number})} pacmanGridPosition - x-y position on the 2D Maze Array
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     * @returns {('up'|'down'|'left'|'right')}
     */
  }, {
    key: "determineBestMove",
    value: function determineBestMove(name, possibleMoves, gridPosition, pacmanGridPosition, mode) {
      var _this = this;
      var bestDistance = mode === 'scared' ? 0 : Infinity;
      var bestMove;
      var target = this.getTarget(name, gridPosition, pacmanGridPosition, mode);
      Object.keys(possibleMoves).forEach(function (move) {
        var distance = _this.calculateDistance(possibleMoves[move], target);
        var betterMove = mode === 'scared' ? distance > bestDistance : distance < bestDistance;
        if (betterMove) {
          bestDistance = distance;
          bestMove = move;
        }
      });
      return bestMove;
    }

    /**
     * Determines the best direction for the ghost to travel in during the current frame
     * @param {('inky'|'blinky'|'pinky'|'clyde')} name - The name of the current ghost
     * @param {({x: number, y: number})} gridPosition - The current x-y position on the 2D Maze Array
     * @param {({x: number, y: number})} pacmanGridPosition - x-y position on the 2D Maze Array
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {Array} mazeArray - 2D array representing the game board
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     * @returns {('up'|'down'|'left'|'right')}
     */
  }, {
    key: "determineDirection",
    value: function determineDirection(name, gridPosition, pacmanGridPosition, direction, mazeArray, mode) {
      var newDirection = direction;
      var possibleMoves = this.determinePossibleMoves(gridPosition, direction, mazeArray);
      if (Object.keys(possibleMoves).length === 1) {
        var _Object$keys = Object.keys(possibleMoves);
        var _Object$keys2 = _slicedToArray(_Object$keys, 1);
        newDirection = _Object$keys2[0];
      } else if (Object.keys(possibleMoves).length > 1) {
        newDirection = this.determineBestMove(name, possibleMoves, gridPosition, pacmanGridPosition, mode);
      }
      return newDirection;
    }

    /**
     * Handles movement for idle Ghosts in the Ghost House
     * @param {*} elapsedMs
     * @param {*} position
     * @param {*} velocity
     * @returns {({ top: number, left: number})}
     */
  }, {
    key: "handleIdleMovement",
    value: function handleIdleMovement(elapsedMs, position, velocity) {
      var newPosition = Object.assign({}, this.position);
      if (position.y <= 13.5) {
        this.direction = this.characterUtil.directions.down;
      } else if (position.y >= 14.5) {
        this.direction = this.characterUtil.directions.up;
      }
      if (this.idleMode === 'leaving') {
        if (position.x === 13.5 && position.y > 10.8 && position.y < 11) {
          this.idleMode = undefined;
          newPosition.top = this.scaledTileSize * 10.5;
          this.direction = this.characterUtil.directions.left;
          window.dispatchEvent(new Event('releaseGhost'));
        } else if (position.x > 13.4 && position.x < 13.6) {
          newPosition.left = this.scaledTileSize * 13;
          this.direction = this.characterUtil.directions.up;
        } else if (position.y > 13.9 && position.y < 14.1) {
          newPosition.top = this.scaledTileSize * 13.5;
          this.direction = position.x < 13.5 ? this.characterUtil.directions.right : this.characterUtil.directions.left;
        }
      }
      newPosition[this.characterUtil.getPropertyToChange(this.direction)] += this.characterUtil.getVelocity(this.direction, velocity) * elapsedMs;
      return newPosition;
    }

    /**
     * Sets idleMode to 'leaving', allowing the ghost to leave the Ghost House
     */
  }, {
    key: "endIdleMode",
    value: function endIdleMode() {
      this.idleMode = 'leaving';
    }

    /**
     * Handle the ghost's movement when it is snapped to the x-y grid of the Maze Array
     * @param {number} elapsedMs - The amount of MS that have passed since the last update
     * @param {({x: number, y: number})} gridPosition - x-y position during the current frame
     * @param {number} velocity - The distance the character should travel in a single millisecond
     * @param {({x: number, y: number})} pacmanGridPosition - x-y position on the 2D Maze Array
     * @returns {({ top: number, left: number})}
     */
  }, {
    key: "handleSnappedMovement",
    value: function handleSnappedMovement(elapsedMs, gridPosition, velocity, pacmanGridPosition) {
      var newPosition = Object.assign({}, this.position);
      this.direction = this.determineDirection(this.name, gridPosition, pacmanGridPosition, this.direction, this.mazeArray, this.mode);
      newPosition[this.characterUtil.getPropertyToChange(this.direction)] += this.characterUtil.getVelocity(this.direction, velocity) * elapsedMs;
      return newPosition;
    }

    /**
     * Determines if an eaten ghost is at the entrance of the Ghost House
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     * @param {({x: number, y: number})} position - x-y position during the current frame
     * @returns {Boolean}
     */
  }, {
    key: "enteringGhostHouse",
    value: function enteringGhostHouse(mode, position) {
      return mode === 'eyes' && position.y === 11 && position.x > 13.4 && position.x < 13.6;
    }

    /**
     * Determines if an eaten ghost has reached the center of the Ghost House
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     * @param {({x: number, y: number})} position - x-y position during the current frame
     * @returns {Boolean}
     */
  }, {
    key: "enteredGhostHouse",
    value: function enteredGhostHouse(mode, position) {
      return mode === 'eyes' && position.x === 13.5 && position.y > 13.8 && position.y < 14.2;
    }

    /**
     * Determines if a restored ghost is at the exit of the Ghost House
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     * @param {({x: number, y: number})} position - x-y position during the current frame
     * @returns {Boolean}
     */
  }, {
    key: "leavingGhostHouse",
    value: function leavingGhostHouse(mode, position) {
      return mode !== 'eyes' && position.x === 13.5 && position.y > 10.8 && position.y < 11;
    }

    /**
     * Handles entering and leaving the Ghost House after a ghost is eaten
     * @param {({x: number, y: number})} gridPosition - x-y position during the current frame
     * @returns {({x: number, y: number})}
     */
  }, {
    key: "handleGhostHouse",
    value: function handleGhostHouse(gridPosition) {
      var gridPositionCopy = Object.assign({}, gridPosition);
      if (this.enteringGhostHouse(this.mode, gridPosition)) {
        this.direction = this.characterUtil.directions.down;
        gridPositionCopy.x = 13.5;
        this.position = this.characterUtil.snapToGrid(gridPositionCopy, this.direction, this.scaledTileSize);
      }
      if (this.enteredGhostHouse(this.mode, gridPosition)) {
        this.direction = this.characterUtil.directions.up;
        gridPositionCopy.y = 14;
        this.position = this.characterUtil.snapToGrid(gridPositionCopy, this.direction, this.scaledTileSize);
        this.mode = this.defaultMode;
        window.dispatchEvent(new Event('restoreGhost'));
      }
      if (this.leavingGhostHouse(this.mode, gridPosition)) {
        gridPositionCopy.y = 11;
        this.position = this.characterUtil.snapToGrid(gridPositionCopy, this.direction, this.scaledTileSize);
        this.direction = this.characterUtil.directions.left;
      }
      return gridPositionCopy;
    }

    /**
     * Handle the ghost's movement when it is inbetween tiles on the x-y grid of the Maze Array
     * @param {number} elapsedMs - The amount of MS that have passed since the last update
     * @param {({x: number, y: number})} gridPosition - x-y position during the current frame
     * @param {number} velocity - The distance the character should travel in a single millisecond
     * @returns {({ top: number, left: number})}
     */
  }, {
    key: "handleUnsnappedMovement",
    value: function handleUnsnappedMovement(elapsedMs, gridPosition, velocity) {
      var gridPositionCopy = this.handleGhostHouse(gridPosition);
      var desired = this.characterUtil.determineNewPositions(this.position, this.direction, velocity, elapsedMs, this.scaledTileSize);
      if (this.characterUtil.changingGridPosition(gridPositionCopy, desired.newGridPosition)) {
        return this.characterUtil.snapToGrid(gridPositionCopy, this.direction, this.scaledTileSize);
      }
      return desired.newPosition;
    }

    /**
     * Determines the new Ghost position
     * @param {number} elapsedMs
     * @returns {({ top: number, left: number})}
     */
  }, {
    key: "handleMovement",
    value: function handleMovement(elapsedMs) {
      var newPosition;
      var gridPosition = this.characterUtil.determineGridPosition(this.position, this.scaledTileSize);
      var pacmanGridPosition = this.characterUtil.determineGridPosition(this.pacman.position, this.scaledTileSize);
      var velocity = this.determineVelocity(gridPosition, this.mode);
      if (this.idleMode) {
        newPosition = this.handleIdleMovement(elapsedMs, gridPosition, velocity);
      } else if (JSON.stringify(this.position) === JSON.stringify(this.characterUtil.snapToGrid(gridPosition, this.direction, this.scaledTileSize))) {
        newPosition = this.handleSnappedMovement(elapsedMs, gridPosition, velocity, pacmanGridPosition);
      } else {
        newPosition = this.handleUnsnappedMovement(elapsedMs, gridPosition, velocity);
      }
      newPosition = this.characterUtil.handleWarp(newPosition, this.scaledTileSize, this.mazeArray);
      this.checkCollision(gridPosition, pacmanGridPosition);
      return newPosition;
    }

    /**
     * Changes the defaultMode to chase or scatter, and turns the ghost around
     * if needed
     * @param {('chase'|'scatter')} newMode
     */
  }, {
    key: "changeMode",
    value: function changeMode(newMode) {
      this.defaultMode = newMode;
      var gridPosition = this.characterUtil.determineGridPosition(this.position, this.scaledTileSize);
      if ((this.mode === 'chase' || this.mode === 'scatter') && !this.cruiseElroy) {
        this.mode = newMode;
        if (!this.isInGhostHouse(gridPosition)) {
          this.direction = this.characterUtil.getOppositeDirection(this.direction);
        }
      }
    }

    /**
     * Toggles a scared ghost between blue and white, then updates its spritsheet
     */
  }, {
    key: "toggleScaredColor",
    value: function toggleScaredColor() {
      this.scaredColor = this.scaredColor === 'blue' ? 'white' : 'blue';
      this.setSpriteSheet(this.name, this.direction, this.mode);
    }

    /**
     * Sets the ghost's mode to SCARED, turns the ghost around,
     * and changes spritesheets accordingly
     */
  }, {
    key: "becomeScared",
    value: function becomeScared() {
      var gridPosition = this.characterUtil.determineGridPosition(this.position, this.scaledTileSize);
      if (this.mode !== 'eyes') {
        if (!this.isInGhostHouse(gridPosition) && this.mode !== 'scared') {
          this.direction = this.characterUtil.getOppositeDirection(this.direction);
        }
        this.mode = 'scared';
        this.scaredColor = 'blue';
        this.setSpriteSheet(this.name, this.direction, this.mode);
      }
    }

    /**
     * Returns the scared ghost to chase/scatter mode and sets its spritesheet
     */
  }, {
    key: "endScared",
    value: function endScared() {
      this.mode = this.defaultMode;
      this.setSpriteSheet(this.name, this.direction, this.mode);
    }

    /**
     * Speeds up the ghost (used for Blinky as Pacdots are eaten)
     */
  }, {
    key: "speedUp",
    value: function speedUp() {
      this.cruiseElroy = true;
      if (this.defaultSpeed === this.slowSpeed) {
        this.defaultSpeed = this.mediumSpeed;
      } else if (this.defaultSpeed === this.mediumSpeed) {
        this.defaultSpeed = this.fastSpeed;
      }
    }

    /**
     * Resets defaultSpeed to slow and updates the spritesheet
     */
  }, {
    key: "resetDefaultSpeed",
    value: function resetDefaultSpeed() {
      this.defaultSpeed = this.slowSpeed;
      this.cruiseElroy = false;
      this.setSpriteSheet(this.name, this.direction, this.mode);
    }

    /**
     * Sets a flag to indicate when the ghost should pause its movement
     * @param {Boolean} newValue
     */
  }, {
    key: "pause",
    value: function pause(newValue) {
      this.paused = newValue;
    }

    /**
     * Checks if the ghost contacts Pacman - starts the death sequence if so
     * @param {({x: number, y: number})} position - An x-y position on the 2D Maze Array
     * @param {({x: number, y: number})} pacman - Pacman's current x-y position on the 2D Maze Array
     */
  }, {
    key: "checkCollision",
    value: function checkCollision(position, pacman) {
      if (this.calculateDistance(position, pacman) < 1 && this.mode !== 'eyes' && this.allowCollision) {
        if (this.mode === 'scared') {
          window.dispatchEvent(new CustomEvent('eatGhost', {
            detail: {
              ghost: this
            }
          }));
          this.mode = 'eyes';
        } else {
          window.dispatchEvent(new Event('deathSequence'));
        }
      }
    }

    /**
     * Determines the appropriate speed for the ghost
     * @param {({x: number, y: number})} position - An x-y position on the 2D Maze Array
     * @param {('chase'|'scatter'|'scared'|'eyes')} mode - The character's behavior mode
     * @returns {number}
     */
  }, {
    key: "determineVelocity",
    value: function determineVelocity(position, mode) {
      if (mode === 'eyes') {
        return this.eyeSpeed;
      }
      if (this.paused) {
        return 0;
      }
      if (this.isInTunnel(position) || this.isInGhostHouse(position)) {
        return this.transitionSpeed;
      }
      if (mode === 'scared') {
        return this.scaredSpeed;
      }
      return this.defaultSpeed;
    }

    /**
     * Updates the css position, hides if there is a stutter, and animates the spritesheet
     * @param {number} interp - The animation accuracy as a percentage
     */
  }, {
    key: "draw",
    value: function draw(interp) {
      var newTop = this.characterUtil.calculateNewDrawValue(interp, 'top', this.oldPosition, this.position);
      var newLeft = this.characterUtil.calculateNewDrawValue(interp, 'left', this.oldPosition, this.position);
      this.animationTarget.style.top = "".concat(newTop, "px");
      this.animationTarget.style.left = "".concat(newLeft, "px");
      this.animationTarget.style.visibility = this.display ? this.characterUtil.checkForStutter(this.position, this.oldPosition) : 'hidden';
      var updatedProperties = this.characterUtil.advanceSpriteSheet(this);
      this.msSinceLastSprite = updatedProperties.msSinceLastSprite;
      this.animationTarget = updatedProperties.animationTarget;
      this.backgroundOffsetPixels = updatedProperties.backgroundOffsetPixels;
    }

    /**
     * Handles movement logic for the ghost
     * @param {number} elapsedMs - The amount of MS that have passed since the last update
     */
  }, {
    key: "update",
    value: function update(elapsedMs) {
      this.oldPosition = Object.assign({}, this.position);
      if (this.moving) {
        this.position = this.handleMovement(elapsedMs);
        this.setSpriteSheet(this.name, this.direction, this.mode);
        this.msSinceLastSprite += elapsedMs;
      }
    }
  }]);
}(); //Just to avoid problems with NYC coverage test
if (!process.env.NYC_PROCESS_ID) global.window.Ghost = Ghost;
// removeIf(production)
//module.exports = Ghost;
// endRemoveIf(production)
//removeIf(production)
var _default = exports["default"] = Ghost; //endRemoveIf(production)

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":9}],2:[function(require,module,exports){
(function (process,global){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var Pacman = /*#__PURE__*/function () {
  function Pacman(scaledTileSize, mazeArray, characterUtil) {
    _classCallCheck(this, Pacman);
    this.scaledTileSize = scaledTileSize;
    this.mazeArray = mazeArray;
    this.characterUtil = characterUtil;
    this.animationTarget = document.getElementById('pacman');
    this.pacmanArrow = document.getElementById('pacman-arrow');
    this.reset();
  }

  /**
   * Rests the character to its default state
   */
  return _createClass(Pacman, [{
    key: "reset",
    value: function reset() {
      this.setMovementStats(this.scaledTileSize);
      this.setSpriteAnimationStats();
      this.setStyleMeasurements(this.scaledTileSize, this.spriteFrames);
      this.setDefaultPosition(this.scaledTileSize);
      this.setSpriteSheet(this.direction);
      this.pacmanArrow.style.backgroundImage = 'url(app/style/graphics/' + "spriteSheets/characters/pacman/arrow_".concat(this.direction, ".svg)");
    }

    /**
     * Sets various properties related to Pacman's movement
     * @param {number} scaledTileSize - The dimensions of a single tile
     */
  }, {
    key: "setMovementStats",
    value: function setMovementStats(scaledTileSize) {
      this.velocityPerMs = this.calculateVelocityPerMs(scaledTileSize);
      this.desiredDirection = this.characterUtil.directions.left;
      this.direction = this.characterUtil.directions.left;
      this.moving = false;
    }

    /**
     * Sets values pertaining to Pacman's spritesheet animation
     */
  }, {
    key: "setSpriteAnimationStats",
    value: function setSpriteAnimationStats() {
      this.specialAnimation = false;
      this.display = true;
      this.animate = true;
      this.loopAnimation = true;
      this.msBetweenSprites = 50;
      this.msSinceLastSprite = 0;
      this.spriteFrames = 4;
      this.backgroundOffsetPixels = 0;
      this.animationTarget.style.backgroundPosition = '0px 0px';
    }

    /**
     * Sets css property values for Pacman and Pacman's Arrow
     * @param {number} scaledTileSize - The dimensions of a single tile
     * @param {number} spriteFrames - The number of frames in Pacman's spritesheet
     */
  }, {
    key: "setStyleMeasurements",
    value: function setStyleMeasurements(scaledTileSize, spriteFrames) {
      this.measurement = scaledTileSize * 2;
      this.animationTarget.style.height = "".concat(this.measurement, "px");
      this.animationTarget.style.width = "".concat(this.measurement, "px");
      this.animationTarget.style.backgroundSize = "".concat(this.measurement * spriteFrames, "px");
      this.pacmanArrow.style.height = "".concat(this.measurement * 2, "px");
      this.pacmanArrow.style.width = "".concat(this.measurement * 2, "px");
      this.pacmanArrow.style.backgroundSize = "".concat(this.measurement * 2, "px");
    }

    /**
     * Sets the default position and direction for Pacman at the game's start
     * @param {number} scaledTileSize - The dimensions of a single tile
     */
  }, {
    key: "setDefaultPosition",
    value: function setDefaultPosition(scaledTileSize) {
      this.defaultPosition = {
        top: scaledTileSize * 22.5,
        left: scaledTileSize * 13
      };
      this.position = Object.assign({}, this.defaultPosition);
      this.oldPosition = Object.assign({}, this.position);
      this.animationTarget.style.top = "".concat(this.position.top, "px");
      this.animationTarget.style.left = "".concat(this.position.left, "px");
    }

    /**
     * Calculates how fast Pacman should move in a millisecond
     * @param {number} scaledTileSize - The dimensions of a single tile
     */
  }, {
    key: "calculateVelocityPerMs",
    value: function calculateVelocityPerMs(scaledTileSize) {
      // In the original game, Pacman moved at 11 tiles per second.
      var velocityPerSecond = scaledTileSize * 11;
      return velocityPerSecond / 1000;
    }

    /**
     * Chooses a movement Spritesheet depending upon direction
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     */
  }, {
    key: "setSpriteSheet",
    value: function setSpriteSheet(direction) {
      this.animationTarget.style.backgroundImage = 'url(app/style/graphics/' + "spriteSheets/characters/pacman/pacman_".concat(direction, ".svg)");
    }
  }, {
    key: "prepDeathAnimation",
    value: function prepDeathAnimation() {
      this.loopAnimation = false;
      this.msBetweenSprites = 125;
      this.spriteFrames = 12;
      this.specialAnimation = true;
      this.backgroundOffsetPixels = 0;
      var bgSize = this.measurement * this.spriteFrames;
      this.animationTarget.style.backgroundSize = "".concat(bgSize, "px");
      this.animationTarget.style.backgroundImage = 'url(app/style/' + 'graphics/spriteSheets/characters/pacman/pacman_death.svg)';
      this.animationTarget.style.backgroundPosition = '0px 0px';
      this.pacmanArrow.style.backgroundImage = '';
    }

    /**
     * Changes Pacman's desiredDirection, updates the PacmanArrow sprite, and sets moving to true
     * @param {Event} e - The keydown event to evaluate
     * @param {Boolean} startMoving - If true, Pacman will move upon key press
     */
  }, {
    key: "changeDirection",
    value: function changeDirection(newDirection, startMoving) {
      this.desiredDirection = newDirection;
      this.pacmanArrow.style.backgroundImage = 'url(app/style/graphics/' + "spriteSheets/characters/pacman/arrow_".concat(this.desiredDirection, ".svg)");
      if (startMoving) {
        this.moving = true;
      }
    }

    /**
     * Updates the position of the leading arrow in front of Pacman
     * @param {({top: number, left: number})} position - Pacman's position during the current frame
     * @param {number} scaledTileSize - The dimensions of a single tile
     */
  }, {
    key: "updatePacmanArrowPosition",
    value: function updatePacmanArrowPosition(position, scaledTileSize) {
      this.pacmanArrow.style.top = "".concat(position.top - scaledTileSize, "px");
      this.pacmanArrow.style.left = "".concat(position.left - scaledTileSize, "px");
    }

    /**
     * Handle Pacman's movement when he is snapped to the x-y grid of the Maze Array
     * @param {number} elapsedMs - The amount of MS that have passed since the last update
     * @returns {({ top: number, left: number})}
     */
  }, {
    key: "handleSnappedMovement",
    value: function handleSnappedMovement(elapsedMs) {
      var desired = this.characterUtil.determineNewPositions(this.position, this.desiredDirection, this.velocityPerMs, elapsedMs, this.scaledTileSize);
      var alternate = this.characterUtil.determineNewPositions(this.position, this.direction, this.velocityPerMs, elapsedMs, this.scaledTileSize);
      if (this.characterUtil.checkForWallCollision(desired.newGridPosition, this.mazeArray, this.desiredDirection)) {
        if (this.characterUtil.checkForWallCollision(alternate.newGridPosition, this.mazeArray, this.direction)) {
          this.moving = false;
          return this.position;
        }
        return alternate.newPosition;
      }
      this.direction = this.desiredDirection;
      this.setSpriteSheet(this.direction);
      return desired.newPosition;
    }

    /**
     * Handle Pacman's movement when he is inbetween tiles on the x-y grid of the Maze Array
     * @param {({x: number, y: number})} gridPosition - x-y position during the current frame
     * @param {number} elapsedMs - The amount of MS that have passed since the last update
     * @returns {({ top: number, left: number})}
     */
  }, {
    key: "handleUnsnappedMovement",
    value: function handleUnsnappedMovement(gridPosition, elapsedMs) {
      var desired = this.characterUtil.determineNewPositions(this.position, this.desiredDirection, this.velocityPerMs, elapsedMs, this.scaledTileSize);
      var alternate = this.characterUtil.determineNewPositions(this.position, this.direction, this.velocityPerMs, elapsedMs, this.scaledTileSize);
      if (this.characterUtil.turningAround(this.direction, this.desiredDirection)) {
        this.direction = this.desiredDirection;
        this.setSpriteSheet(this.direction);
        return desired.newPosition;
      }
      if (this.characterUtil.changingGridPosition(gridPosition, alternate.newGridPosition)) {
        return this.characterUtil.snapToGrid(gridPosition, this.direction, this.scaledTileSize);
      }
      return alternate.newPosition;
    }

    /**
     * Updates the css position, hides if there is a stutter, and animates the spritesheet
     * @param {number} interp - The animation accuracy as a percentage
     */
  }, {
    key: "draw",
    value: function draw(interp) {
      var newTop = this.characterUtil.calculateNewDrawValue(interp, 'top', this.oldPosition, this.position);
      var newLeft = this.characterUtil.calculateNewDrawValue(interp, 'left', this.oldPosition, this.position);
      this.animationTarget.style.top = "".concat(newTop, "px");
      this.animationTarget.style.left = "".concat(newLeft, "px");
      this.animationTarget.style.visibility = this.display ? this.characterUtil.checkForStutter(this.position, this.oldPosition) : 'hidden';
      this.pacmanArrow.style.visibility = this.animationTarget.style.visibility;
      this.updatePacmanArrowPosition(this.position, this.scaledTileSize);
      var updatedProperties = this.characterUtil.advanceSpriteSheet(this);
      this.msSinceLastSprite = updatedProperties.msSinceLastSprite;
      this.animationTarget = updatedProperties.animationTarget;
      this.backgroundOffsetPixels = updatedProperties.backgroundOffsetPixels;
    }

    /**
     * Handles movement logic for Pacman
     * @param {number} elapsedMs - The amount of MS that have passed since the last update
     */
  }, {
    key: "update",
    value: function update(elapsedMs) {
      this.oldPosition = Object.assign({}, this.position);
      if (this.moving) {
        var gridPosition = this.characterUtil.determineGridPosition(this.position, this.scaledTileSize);
        if (JSON.stringify(this.position) === JSON.stringify(this.characterUtil.snapToGrid(gridPosition, this.direction, this.scaledTileSize))) {
          this.position = this.handleSnappedMovement(elapsedMs);
        } else {
          this.position = this.handleUnsnappedMovement(gridPosition, elapsedMs);
        }
        this.position = this.characterUtil.handleWarp(this.position, this.scaledTileSize, this.mazeArray);
      }
      if (this.moving || this.specialAnimation) {
        this.msSinceLastSprite += elapsedMs;
      }
    }
  }]);
}(); //Just to avoid problems with NYC coverage test
if (!process.env.NYC_PROCESS_ID) global.window.Pacman = Pacman;
// removeIf(production)
//module.exports = Pacman;
var _default = exports["default"] = Pacman; // endRemoveIf(production)

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":9}],3:[function(require,module,exports){
(function (process,global){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
//import path from 'path'
var GameCoordinator = /*#__PURE__*/function () {
  function GameCoordinator() {
    var _this = this;
    _classCallCheck(this, GameCoordinator);
    console.log("called constructor");
    //  console.log(path.dirname)
    //alert("Game Coordinator")  
    this.gameUi = document.getElementById('game-ui');
    this.rowTop = document.getElementById('row-top');
    this.mazeDiv = document.getElementById('maze');
    this.mazeImg = document.getElementById('maze-img');
    this.mazeCover = document.getElementById('maze-cover');
    this.pointsDisplay = document.getElementById('points-display');
    this.highScoreDisplay = document.getElementById('high-score-display');
    this.extraLivesDisplay = document.getElementById('extra-lives');
    this.fruitDisplay = document.getElementById('fruit-display');
    this.mainMenu = document.getElementById('main-menu-container');
    this.gameStartButton = document.getElementById('game-start');
    this.pauseButton = document.getElementById('pause-button');
    this.soundButton = document.getElementById('sound-button');
    this.leftCover = document.getElementById('left-cover');
    this.rightCover = document.getElementById('right-cover');
    this.pausedText = document.getElementById('paused-text');
    this.bottomRow = document.getElementById('bottom-row');
    this.movementButtons = document.getElementById('movement-buttons');
    this.mazeArray = [['XXXXXXXXXXXXXXXXXXXXXXXXXXXX'], ['XooooooooooooXXooooooooooooX'], ['XoXXXXoXXXXXoXXoXXXXXoXXXXoX'], ['XOXXXXoXXXXXoXXoXXXXXoXXXXOX'], ['XoXXXXoXXXXXoXXoXXXXXoXXXXoX'], ['XooooooooooooooooooooooooooX'], ['XoXXXXoXXoXXXXXXXXoXXoXXXXoX'], ['XoXXXXoXXoXXXXXXXXoXXoXXXXoX'], ['XooooooXXooooXXooooXXooooooX'], ['XXXXXXoXXXXX XX XXXXXoXXXXXX'], ['XXXXXXoXXXXX XX XXXXXoXXXXXX'], ['XXXXXXoXX          XXoXXXXXX'], ['XXXXXXoXX XXXXXXXX XXoXXXXXX'], ['XXXXXXoXX X      X XXoXXXXXX'], ['      o   X      X   o      '], ['XXXXXXoXX X      X XXoXXXXXX'], ['XXXXXXoXX XXXXXXXX XXoXXXXXX'], ['XXXXXXoXX          XXoXXXXXX'], ['XXXXXXoXX XXXXXXXX XXoXXXXXX'], ['XXXXXXoXX XXXXXXXX XXoXXXXXX'], ['XooooooooooooXXooooooooooooX'], ['XoXXXXoXXXXXoXXoXXXXXoXXXXoX'], ['XoXXXXoXXXXXoXXoXXXXXoXXXXoX'], ['XOooXXooooooo  oooooooXXooOX'], ['XXXoXXoXXoXXXXXXXXoXXoXXoXXX'], ['XXXoXXoXXoXXXXXXXXoXXoXXoXXX'], ['XooooooXXooooXXooooXXooooooX'], ['XoXXXXXXXXXXoXXoXXXXXXXXXXoX'], ['XoXXXXXXXXXXoXXoXXXXXXXXXXoX'], ['XooooooooooooooooooooooooooX'], ['XXXXXXXXXXXXXXXXXXXXXXXXXXXX']];
    this.maxFps = 120;
    this.tileSize = 8;
    this.scale = this.determineScale(1);
    this.scaledTileSize = this.tileSize * this.scale;
    this.firstGame = true;
    this.movementKeys = {
      // WASD
      87: 'up',
      83: 'down',
      65: 'left',
      68: 'right',
      // Arrow Keys
      38: 'up',
      40: 'down',
      37: 'left',
      39: 'right'
    };
    this.fruitPoints = {
      1: 100,
      2: 300,
      3: 500,
      4: 700,
      5: 1000,
      6: 2000,
      7: 3000,
      8: 5000
    };
    this.mazeArray.forEach(function (row, rowIndex) {
      _this.mazeArray[rowIndex] = row[0].split('');
    });
    this.gameStartButton.addEventListener('click', this.startButtonClick.bind(this));
    this.pauseButton.addEventListener('click', this.handlePauseKey.bind(this));
    this.soundButton.addEventListener('click', this.soundButtonClick.bind(this));
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'build/app.css';
    link.onload = this.preloadAssets.bind(this);
    head.appendChild(link);
  }

  /**
   * Recursive method which determines the largest possible scale the game's graphics can use
   * @param {Number} scale
   */
  return _createClass(GameCoordinator, [{
    key: "determineScale",
    value: function determineScale(scale) {
      var availableScreenHeight = Math.min(document.documentElement.clientHeight, window.innerHeight || 0);
      var availableScreenWidth = Math.min(document.documentElement.clientWidth, window.innerWidth || 0);
      var scaledTileSize = this.tileSize * scale;

      // The original Pac-Man game leaves 5 tiles of height (3 above, 2 below) surrounding the
      // maze for the UI. See app\style\graphics\spriteSheets\references\mazeGridSystemReference.png
      // for reference.
      var mazeTileHeight = this.mazeArray.length + 5;
      var mazeTileWidth = this.mazeArray[0][0].split('').length;
      if (scaledTileSize * mazeTileHeight < availableScreenHeight && scaledTileSize * mazeTileWidth < availableScreenWidth) {
        return this.determineScale(scale + 1);
      }
      return scale - 1;
    }

    /**
     * Reveals the game underneath the loading covers and starts gameplay
     */
  }, {
    key: "startButtonClick",
    value: function startButtonClick() {
      var _this2 = this;
      this.leftCover.style.left = '-50%';
      this.rightCover.style.right = '-50%';
      this.mainMenu.style.opacity = 0;
      this.gameStartButton.disabled = true;
      setTimeout(function () {
        _this2.mainMenu.style.visibility = 'hidden';
      }, 1000);
      this.reset();
      if (this.firstGame) {
        this.firstGame = false;
        this.init();
      }
      this.startGameplay(true);
    }

    /**
     * Toggles the master volume for the soundManager, and saves the preference to storage
     */
  }, {
    key: "soundButtonClick",
    value: function soundButtonClick() {
      var newVolume = this.soundManager.masterVolume === 1 ? 0 : 1;
      this.soundManager.setMasterVolume(newVolume);
      localStorage.setItem('volumePreference', newVolume);
      this.setSoundButtonIcon(newVolume);
    }

    /**
     * Sets the icon for the sound button
     */
  }, {
    key: "setSoundButtonIcon",
    value: function setSoundButtonIcon(newVolume) {
      this.soundButton.innerHTML = newVolume === 0 ? 'volume_off' : 'volume_up';
    }

    /**
     * Displays an error message in the event assets are unable to download
     */
  }, {
    key: "displayErrorMessage",
    value: function displayErrorMessage() {
      var loadingContainer = document.getElementById('loading-container');
      var errorMessage = document.getElementById('error-message');
      loadingContainer.style.opacity = 0;
      setTimeout(function () {
        loadingContainer.remove();
        errorMessage.style.opacity = 1;
        errorMessage.style.visibility = 'visible';
      }, 1500);
    }

    /**
     * Load all assets into a hidden Div to pre-load them into memory.
     * There is probably a better way to read all of these file names.
     */
  }, {
    key: "preloadAssets",
    value: function preloadAssets() {
      var _this3 = this;
      return new Promise(function (resolve) {
        var loadingContainer = document.getElementById('loading-container');
        var loadingPacman = document.getElementById('loading-pacman');
        var loadingDotMask = document.getElementById('loading-dot-mask');
        var imgBase = 'app/style/graphics/spriteSheets/';
        var imgSources = [
        // Pacman
        "".concat(imgBase, "characters/pacman/arrow_down.svg"), "".concat(imgBase, "characters/pacman/arrow_left.svg"), "".concat(imgBase, "characters/pacman/arrow_right.svg"), "".concat(imgBase, "characters/pacman/arrow_up.svg"), "".concat(imgBase, "characters/pacman/pacman_death.svg"), "".concat(imgBase, "characters/pacman/pacman_error.svg"), "".concat(imgBase, "characters/pacman/pacman_down.svg"), "".concat(imgBase, "characters/pacman/pacman_left.svg"), "".concat(imgBase, "characters/pacman/pacman_right.svg"), "".concat(imgBase, "characters/pacman/pacman_up.svg"),
        // Blinky
        "".concat(imgBase, "characters/ghosts/blinky/blinky_down_angry.svg"), "".concat(imgBase, "characters/ghosts/blinky/blinky_down_annoyed.svg"), "".concat(imgBase, "characters/ghosts/blinky/blinky_down.svg"), "".concat(imgBase, "characters/ghosts/blinky/blinky_left_angry.svg"), "".concat(imgBase, "characters/ghosts/blinky/blinky_left_annoyed.svg"), "".concat(imgBase, "characters/ghosts/blinky/blinky_left.svg"), "".concat(imgBase, "characters/ghosts/blinky/blinky_right_angry.svg"), "".concat(imgBase, "characters/ghosts/blinky/blinky_right_annoyed.svg"), "".concat(imgBase, "characters/ghosts/blinky/blinky_right.svg"), "".concat(imgBase, "characters/ghosts/blinky/blinky_up_angry.svg"), "".concat(imgBase, "characters/ghosts/blinky/blinky_up_annoyed.svg"), "".concat(imgBase, "characters/ghosts/blinky/blinky_up.svg"),
        // Clyde
        "".concat(imgBase, "characters/ghosts/clyde/clyde_down.svg"), "".concat(imgBase, "characters/ghosts/clyde/clyde_left.svg"), "".concat(imgBase, "characters/ghosts/clyde/clyde_right.svg"), "".concat(imgBase, "characters/ghosts/clyde/clyde_up.svg"),
        // Inky
        "".concat(imgBase, "characters/ghosts/inky/inky_down.svg"), "".concat(imgBase, "characters/ghosts/inky/inky_left.svg"), "".concat(imgBase, "characters/ghosts/inky/inky_right.svg"), "".concat(imgBase, "characters/ghosts/inky/inky_up.svg"),
        // Pinky
        "".concat(imgBase, "characters/ghosts/pinky/pinky_down.svg"), "".concat(imgBase, "characters/ghosts/pinky/pinky_left.svg"), "".concat(imgBase, "characters/ghosts/pinky/pinky_right.svg"), "".concat(imgBase, "characters/ghosts/pinky/pinky_up.svg"),
        // Ghosts Common
        "".concat(imgBase, "characters/ghosts/eyes_down.svg"), "".concat(imgBase, "characters/ghosts/eyes_left.svg"), "".concat(imgBase, "characters/ghosts/eyes_right.svg"), "".concat(imgBase, "characters/ghosts/eyes_up.svg"), "".concat(imgBase, "characters/ghosts/scared_blue.svg"), "".concat(imgBase, "characters/ghosts/scared_white.svg"),
        // Dots
        "".concat(imgBase, "pickups/pacdot.svg"), "".concat(imgBase, "pickups/powerPellet.svg"),
        // Fruit
        "".concat(imgBase, "pickups/apple.svg"), "".concat(imgBase, "pickups/bell.svg"), "".concat(imgBase, "pickups/cherry.svg"), "".concat(imgBase, "pickups/galaxian.svg"), "".concat(imgBase, "pickups/key.svg"), "".concat(imgBase, "pickups/melon.svg"), "".concat(imgBase, "pickups/orange.svg"), "".concat(imgBase, "pickups/strawberry.svg"),
        // Text
        "".concat(imgBase, "text/ready.svg"),
        // Points
        "".concat(imgBase, "text/100.svg"), "".concat(imgBase, "text/200.svg"), "".concat(imgBase, "text/300.svg"), "".concat(imgBase, "text/400.svg"), "".concat(imgBase, "text/500.svg"), "".concat(imgBase, "text/700.svg"), "".concat(imgBase, "text/800.svg"), "".concat(imgBase, "text/1000.svg"), "".concat(imgBase, "text/1600.svg"), "".concat(imgBase, "text/2000.svg"), "".concat(imgBase, "text/3000.svg"), "".concat(imgBase, "text/5000.svg"),
        // Maze
        "".concat(imgBase, "maze/maze_blue.svg"),
        // Misc
        'app/style/graphics/extra_life.png'];
        var audioBase = 'app/style/audio/';
        var audioSources = ["".concat(audioBase, "game_start.mp3"), "".concat(audioBase, "pause.mp3"), "".concat(audioBase, "pause_beat.mp3"), "".concat(audioBase, "siren_1.mp3"), "".concat(audioBase, "siren_2.mp3"), "".concat(audioBase, "siren_3.mp3"), "".concat(audioBase, "power_up.mp3"), "".concat(audioBase, "extra_life.mp3"), "".concat(audioBase, "eyes.mp3"), "".concat(audioBase, "eat_ghost.mp3"), "".concat(audioBase, "death.mp3"), "".concat(audioBase, "fruit.mp3"), "".concat(audioBase, "dot_1.mp3"), "".concat(audioBase, "dot_2.mp3")];
        var totalSources = imgSources.length + audioSources.length;
        _this3.remainingSources = totalSources;
        loadingPacman.style.left = '0';
        loadingDotMask.style.width = '0';
        Promise.all([_this3.createElements(imgSources, 'img', totalSources, _this3), _this3.createElements(audioSources, 'audio', totalSources, _this3)]).then(function () {
          loadingContainer.style.opacity = 0;
          resolve();
          setTimeout(function () {
            loadingContainer.remove();
            _this3.mainMenu.style.opacity = 1;
            _this3.mainMenu.style.visibility = 'visible';
          }, 1500);
        })["catch"](_this3.displayErrorMessage);
      });
    }

    /**
     * Iterates through a list of sources and updates the loading bar as the assets load in
     * @param {String[]} sources
     * @param {('img'|'audio')} type
     * @param {Number} totalSources
     * @param {Object} gameCoord
     * @returns {Promise}
     */
  }, {
    key: "createElements",
    value: function createElements(sources, type, totalSources, gameCoord) {
      var loadingContainer = document.getElementById('loading-container');
      var preloadDiv = document.getElementById('preload-div');
      var loadingPacman = document.getElementById('loading-pacman');
      var containerWidth = loadingContainer.scrollWidth - loadingPacman.scrollWidth;
      var loadingDotMask = document.getElementById('loading-dot-mask');
      var gameCoordRef = gameCoord;
      return new Promise(function (resolve, reject) {
        var loadedSources = 0;
        sources.forEach(function (source) {
          var element = type === 'img' ? new Image() : new Audio();
          preloadDiv.appendChild(element);
          var elementReady = function elementReady() {
            gameCoordRef.remainingSources -= 1;
            loadedSources += 1;
            var percent = 1 - gameCoordRef.remainingSources / totalSources;
            loadingPacman.style.left = "".concat(percent * containerWidth, "px");
            loadingDotMask.style.width = loadingPacman.style.left;
            if (loadedSources === sources.length) {
              resolve();
            }
          };
          if (type === 'img') {
            element.onload = elementReady;
            element.onerror = reject;
          } else {
            element.addEventListener('canplaythrough', elementReady);
            element.onerror = reject;
          }
          element.src = source;
          if (type === 'audio') {
            element.load();
          }
        });
      });
    }

    /**
     * Resets gameCoordinator values to their default states
     */
  }, {
    key: "reset",
    value: function reset() {
      var _this4 = this;
      this.activeTimers = [];
      this.points = 0;
      this.level = 1;
      this.lives = 2;
      this.extraLifeGiven = false;
      this.remainingDots = 0;
      this.allowKeyPresses = true;
      this.allowPacmanMovement = false;
      this.allowPause = false;
      this.cutscene = true;
      this.highScore = localStorage.getItem('highScore');
      if (this.firstGame) {
        setInterval(function () {
          _this4.collisionDetectionLoop();
        }, 500);
        this.pacman = new Pacman(this.scaledTileSize, this.mazeArray, new CharacterUtil());
        this.blinky = new Ghost(this.scaledTileSize, this.mazeArray, this.pacman, 'blinky', this.level, new CharacterUtil());
        this.pinky = new Ghost(this.scaledTileSize, this.mazeArray, this.pacman, 'pinky', this.level, new CharacterUtil());
        this.inky = new Ghost(this.scaledTileSize, this.mazeArray, this.pacman, 'inky', this.level, new CharacterUtil(), this.blinky);
        this.clyde = new Ghost(this.scaledTileSize, this.mazeArray, this.pacman, 'clyde', this.level, new CharacterUtil());
        this.fruit = new Pickup('fruit', this.scaledTileSize, 13.5, 17, this.pacman, this.mazeDiv, 100);
      }
      this.entityList = [this.pacman, this.blinky, this.pinky, this.inky, this.clyde, this.fruit];
      this.ghosts = [this.blinky, this.pinky, this.inky, this.clyde];
      this.scaredGhosts = [];
      this.eyeGhosts = 0;
      if (this.firstGame) {
        this.drawMaze(this.mazeArray, this.entityList);
        this.soundManager = new SoundManager();
        this.setUiDimensions();
      } else {
        this.pacman.reset();
        this.ghosts.forEach(function (ghost) {
          ghost.reset(true);
        });
        this.pickups.forEach(function (pickup) {
          if (pickup.type !== 'fruit') {
            _this4.remainingDots += 1;
            pickup.reset();
            _this4.entityList.push(pickup);
          }
        });
      }
      this.pointsDisplay.innerHTML = '00';
      this.highScoreDisplay.innerHTML = this.highScore || '00';
      this.clearDisplay(this.fruitDisplay);
      var volumePreference = parseInt(localStorage.getItem('volumePreference') || 1, 10);
      this.setSoundButtonIcon(volumePreference);
      this.soundManager.setMasterVolume(volumePreference);
    }

    /**
     * Calls necessary setup functions to start the game
     */
  }, {
    key: "init",
    value: function init() {
      this.registerEventListeners();
      this.gameEngine = new GameEngine(this.maxFps, this.entityList);
      this.gameEngine.start();
    }

    /**
     * Adds HTML elements to draw on the webpage by iterating through the 2D maze array
     * @param {Array} mazeArray - 2D array representing the game board
     * @param {Array} entityList - List of entities to be used throughout the game
     */
  }, {
    key: "drawMaze",
    value: function drawMaze(mazeArray, entityList) {
      var _this5 = this;
      this.pickups = [this.fruit];
      this.mazeDiv.style.height = "".concat(this.scaledTileSize * 31, "px");
      this.mazeDiv.style.width = "".concat(this.scaledTileSize * 28, "px");
      this.gameUi.style.width = "".concat(this.scaledTileSize * 28, "px");
      this.bottomRow.style.minHeight = "".concat(this.scaledTileSize * 2, "px");
      this.dotContainer = document.getElementById('dot-container');
      mazeArray.forEach(function (row, rowIndex) {
        row.forEach(function (block, columnIndex) {
          if (block === 'o' || block === 'O') {
            var type = block === 'o' ? 'pacdot' : 'powerPellet';
            var points = block === 'o' ? 10 : 50;
            var dot = new Pickup(type, _this5.scaledTileSize, columnIndex, rowIndex, _this5.pacman, _this5.dotContainer, points);
            entityList.push(dot);
            _this5.pickups.push(dot);
            _this5.remainingDots += 1;
          }
        });
      });
    }
  }, {
    key: "setUiDimensions",
    value: function setUiDimensions() {
      this.gameUi.style.fontSize = "".concat(this.scaledTileSize, "px");
      this.rowTop.style.marginBottom = "".concat(this.scaledTileSize, "px");
    }

    /**
     * Loop which periodically checks which pickups are nearby Pacman.
     * Pickups which are far away will not be considered for collision detection.
     */
  }, {
    key: "collisionDetectionLoop",
    value: function collisionDetectionLoop() {
      if (this.pacman.position) {
        var maxDistance = this.pacman.velocityPerMs * 750;
        var pacmanCenter = {
          x: this.pacman.position.left + this.scaledTileSize,
          y: this.pacman.position.top + this.scaledTileSize
        };

        // Set this flag to TRUE to see how two-phase collision detection works!
        var debugging = false;
        this.pickups.forEach(function (pickup) {
          pickup.checkPacmanProximity(maxDistance, pacmanCenter, debugging);
        });
      }
    }

    /**
     * Displays "Ready!" and allows Pacman to move after a breif delay
     * @param {Boolean} initialStart - Special condition for the game's beginning
     */
  }, {
    key: "startGameplay",
    value: function startGameplay(initialStart) {
      var _this6 = this;
      if (initialStart) {
        this.soundManager.play('game_start');
      }
      this.scaredGhosts = [];
      this.eyeGhosts = 0;
      this.allowPacmanMovement = false;
      var left = this.scaledTileSize * 11;
      var top = this.scaledTileSize * 16.5;
      var duration = initialStart ? 4500 : 2000;
      var width = this.scaledTileSize * 6;
      var height = this.scaledTileSize * 2;
      this.displayText({
        left: left,
        top: top
      }, 'ready', duration, width, height);
      this.updateExtraLivesDisplay();
      new Timer(function () {
        _this6.allowPause = true;
        _this6.cutscene = false;
        _this6.soundManager.setCutscene(_this6.cutscene);
        _this6.soundManager.setAmbience(_this6.determineSiren(_this6.remainingDots));
        _this6.allowPacmanMovement = true;
        _this6.pacman.moving = true;
        _this6.ghosts.forEach(function (ghost) {
          var ghostRef = ghost;
          ghostRef.moving = true;
        });
        _this6.ghostCycle('scatter');
        _this6.idleGhosts = [_this6.pinky, _this6.inky, _this6.clyde];
        _this6.releaseGhost();
      }, duration);
    }

    /**
     * Clears out all children nodes from a given display element
     * @param {String} display
     */
  }, {
    key: "clearDisplay",
    value: function clearDisplay(display) {
      while (display.firstChild) {
        display.removeChild(display.firstChild);
      }
    }

    /**
     * Displays extra life images equal to the number of remaining lives
     */
  }, {
    key: "updateExtraLivesDisplay",
    value: function updateExtraLivesDisplay() {
      this.clearDisplay(this.extraLivesDisplay);
      for (var i = 0; i < this.lives; i += 1) {
        var extraLifePic = document.createElement('img');
        extraLifePic.setAttribute('src', 'app/style/graphics/extra_life.svg');
        extraLifePic.style.height = "".concat(this.scaledTileSize * 2, "px");
        this.extraLivesDisplay.appendChild(extraLifePic);
      }
    }

    /**
     * Displays a rolling log of the seven most-recently eaten fruit
     * @param {String} rawImageSource
     */
  }, {
    key: "updateFruitDisplay",
    value: function updateFruitDisplay(rawImageSource) {
      var parsedSource = rawImageSource.slice(rawImageSource.indexOf('(') + 1, rawImageSource.indexOf(')'));
      if (this.fruitDisplay.children.length === 7) {
        this.fruitDisplay.removeChild(this.fruitDisplay.firstChild);
      }
      var fruitPic = document.createElement('img');
      fruitPic.setAttribute('src', parsedSource);
      fruitPic.style.height = "".concat(this.scaledTileSize * 2, "px");
      this.fruitDisplay.appendChild(fruitPic);
    }

    /**
     * Cycles the ghosts between 'chase' and 'scatter' mode
     * @param {('chase'|'scatter')} mode
     */
  }, {
    key: "ghostCycle",
    value: function ghostCycle(mode) {
      var _this7 = this;
      var delay = mode === 'scatter' ? 7000 : 20000;
      var nextMode = mode === 'scatter' ? 'chase' : 'scatter';
      this.ghostCycleTimer = new Timer(function () {
        _this7.ghosts.forEach(function (ghost) {
          ghost.changeMode(nextMode);
        });
        _this7.ghostCycle(nextMode);
      }, delay);
    }

    /**
     * Releases a ghost from the Ghost House after a delay
     */
  }, {
    key: "releaseGhost",
    value: function releaseGhost() {
      var _this8 = this;
      if (this.idleGhosts.length > 0) {
        var delay = Math.max((8 - (this.level - 1) * 4) * 1000, 0);
        this.endIdleTimer = new Timer(function () {
          _this8.idleGhosts[0].endIdleMode();
          _this8.idleGhosts.shift();
        }, delay);
      }
    }

    /**
     * Register listeners for various game sequences
     */
  }, {
    key: "registerEventListeners",
    value: function registerEventListeners() {
      var _this9 = this;
      window.addEventListener('keydown', this.handleKeyDown.bind(this));
      window.addEventListener('awardPoints', this.awardPoints.bind(this));
      window.addEventListener('deathSequence', this.deathSequence.bind(this));
      window.addEventListener('dotEaten', this.dotEaten.bind(this));
      window.addEventListener('powerUp', this.powerUp.bind(this));
      window.addEventListener('eatGhost', this.eatGhost.bind(this));
      window.addEventListener('restoreGhost', this.restoreGhost.bind(this));
      window.addEventListener('addTimer', this.addTimer.bind(this));
      window.addEventListener('removeTimer', this.removeTimer.bind(this));
      window.addEventListener('releaseGhost', this.releaseGhost.bind(this));
      var directions = ['up', 'down', 'left', 'right'];
      directions.forEach(function (direction) {
        document.getElementById("button-".concat(direction)).addEventListener('touchstart', function () {
          _this9.changeDirection(direction);
        });
      });
    }

    /**
     * Calls Pacman's changeDirection event if certain conditions are met
     * @param {({'up'|'down'|'left'|'right'})} direction
     */
  }, {
    key: "changeDirection",
    value: function changeDirection(direction) {
      if (this.allowKeyPresses && this.gameEngine.running) {
        this.pacman.changeDirection(direction, this.allowPacmanMovement);
      }
    }

    /**
     * Calls various class functions depending upon the pressed key
     * @param {Event} e - The keydown event to evaluate
     */
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      if (e.keyCode === 27) {
        // ESC key
        this.handlePauseKey();
      } else if (e.keyCode === 81) {
        // Q
        this.soundButtonClick();
      } else if (this.movementKeys[e.keyCode]) {
        this.changeDirection(this.movementKeys[e.keyCode]);
      }
    }

    /**
     * Handle behavior for the pause key
     */
  }, {
    key: "handlePauseKey",
    value: function handlePauseKey() {
      var _this0 = this;
      if (this.allowPause) {
        this.allowPause = false;
        setTimeout(function () {
          if (!_this0.cutscene) {
            _this0.allowPause = true;
          }
        }, 500);
        this.gameEngine.changePausedState(this.gameEngine.running);
        this.soundManager.play('pause');
        if (this.gameEngine.started) {
          this.soundManager.resumeAmbience();
          this.gameUi.style.filter = 'unset';
          this.movementButtons.style.filter = 'unset';
          this.pausedText.style.visibility = 'hidden';
          this.pauseButton.innerHTML = 'pause';
          this.activeTimers.forEach(function (timer) {
            timer.resume();
          });
        } else {
          this.soundManager.stopAmbience();
          this.soundManager.setAmbience('pause_beat', true);
          this.gameUi.style.filter = 'blur(5px)';
          this.movementButtons.style.filter = 'blur(5px)';
          this.pausedText.style.visibility = 'visible';
          this.pauseButton.innerHTML = 'play_arrow';
          this.activeTimers.forEach(function (timer) {
            timer.pause();
          });
        }
      }
    }

    /**
     * Adds points to the player's total
     * @param {({ detail: { points: Number }})} e - Contains a quantity of points to add
     */
  }, {
    key: "awardPoints",
    value: function awardPoints(e) {
      this.points += e.detail.points;
      this.pointsDisplay.innerText = this.points;
      if (this.points > (this.highScore || 0)) {
        this.highScore = this.points;
        this.highScoreDisplay.innerText = this.points;
        localStorage.setItem('highScore', this.highScore);
      }
      if (this.points >= 10000 && !this.extraLifeGiven) {
        this.extraLifeGiven = true;
        this.soundManager.play('extra_life');
        this.lives += 1;
        this.updateExtraLivesDisplay();
      }
      if (e.detail.type === 'fruit') {
        var left = e.detail.points >= 1000 ? this.scaledTileSize * 12.5 : this.scaledTileSize * 13;
        var top = this.scaledTileSize * 16.5;
        var width = e.detail.points >= 1000 ? this.scaledTileSize * 3 : this.scaledTileSize * 2;
        var height = this.scaledTileSize * 2;
        this.displayText({
          left: left,
          top: top
        }, e.detail.points, 2000, width, height);
        this.soundManager.play('fruit');
        this.updateFruitDisplay(this.fruit.determineImage('fruit', e.detail.points));
      }
    }

    /**
     * Animates Pacman's death, subtracts a life, and resets character positions if
     * the player has remaining lives.
     */
  }, {
    key: "deathSequence",
    value: function deathSequence() {
      var _this1 = this;
      this.allowPause = false;
      this.cutscene = true;
      this.soundManager.setCutscene(this.cutscene);
      this.soundManager.stopAmbience();
      this.removeTimer({
        detail: {
          timer: this.fruitTimer
        }
      });
      this.removeTimer({
        detail: {
          timer: this.ghostCycleTimer
        }
      });
      this.removeTimer({
        detail: {
          timer: this.endIdleTimer
        }
      });
      this.removeTimer({
        detail: {
          timer: this.ghostFlashTimer
        }
      });
      this.allowKeyPresses = false;
      this.pacman.moving = false;
      this.ghosts.forEach(function (ghost) {
        var ghostRef = ghost;
        ghostRef.moving = false;
      });
      new Timer(function () {
        _this1.ghosts.forEach(function (ghost) {
          var ghostRef = ghost;
          ghostRef.display = false;
        });
        _this1.pacman.prepDeathAnimation();
        _this1.soundManager.play('death');
        if (_this1.lives > 0) {
          _this1.lives -= 1;
          new Timer(function () {
            _this1.mazeCover.style.visibility = 'visible';
            new Timer(function () {
              _this1.allowKeyPresses = true;
              _this1.mazeCover.style.visibility = 'hidden';
              _this1.pacman.reset();
              _this1.ghosts.forEach(function (ghost) {
                ghost.reset();
              });
              _this1.fruit.hideFruit();
              _this1.startGameplay();
            }, 500);
          }, 2250);
        } else {
          _this1.gameOver();
        }
      }, 750);
    }

    /**
     * Displays GAME OVER text and displays the menu so players can play again
     */
  }, {
    key: "gameOver",
    value: function gameOver() {
      var _this10 = this;
      localStorage.setItem('highScore', this.highScore);
      new Timer(function () {
        _this10.displayText({
          left: _this10.scaledTileSize * 9,
          top: _this10.scaledTileSize * 16.5
        }, 'game_over', 4000, _this10.scaledTileSize * 10, _this10.scaledTileSize * 2);
        _this10.fruit.hideFruit();
        new Timer(function () {
          _this10.leftCover.style.left = '0';
          _this10.rightCover.style.right = '0';
          setTimeout(function () {
            _this10.mainMenu.style.opacity = 1;
            _this10.gameStartButton.disabled = false;
            _this10.mainMenu.style.visibility = 'visible';
          }, 1000);
        }, 2500);
      }, 2250);
    }

    /**
     * Handle events related to the number of remaining dots
     */
  }, {
    key: "dotEaten",
    value: function dotEaten() {
      this.remainingDots -= 1;
      this.soundManager.playDotSound();
      if (this.remainingDots === 174 || this.remainingDots === 74) {
        this.createFruit();
      }
      if (this.remainingDots === 40 || this.remainingDots === 20) {
        this.speedUpBlinky();
      }
      if (this.remainingDots === 0) {
        this.advanceLevel();
      }
    }

    /**
     * Creates a bonus fruit for ten seconds
     */
  }, {
    key: "createFruit",
    value: function createFruit() {
      var _this11 = this;
      this.removeTimer({
        detail: {
          timer: this.fruitTimer
        }
      });
      this.fruit.showFruit(this.fruitPoints[this.level] || 5000);
      this.fruitTimer = new Timer(function () {
        _this11.fruit.hideFruit();
      }, 10000);
    }

    /**
     * Speeds up Blinky and raises the background noise pitch
     */
  }, {
    key: "speedUpBlinky",
    value: function speedUpBlinky() {
      this.blinky.speedUp();
      if (this.scaredGhosts.length === 0 && this.eyeGhosts === 0) {
        this.soundManager.setAmbience(this.determineSiren(this.remainingDots));
      }
    }

    /**
     * Determines the correct siren ambience
     * @param {Number} remainingDots
     * @returns {String}
     */
  }, {
    key: "determineSiren",
    value: function determineSiren(remainingDots) {
      var sirenNum;
      if (remainingDots > 40) {
        sirenNum = 1;
      } else if (remainingDots > 20) {
        sirenNum = 2;
      } else {
        sirenNum = 3;
      }
      return "siren_".concat(sirenNum);
    }

    /**
     * Resets the gameboard and prepares the next level
     */
  }, {
    key: "advanceLevel",
    value: function advanceLevel() {
      var _this12 = this;
      this.allowPause = false;
      this.cutscene = true;
      this.soundManager.setCutscene(this.cutscene);
      this.allowKeyPresses = false;
      this.soundManager.stopAmbience();
      this.entityList.forEach(function (entity) {
        var entityRef = entity;
        entityRef.moving = false;
      });
      this.removeTimer({
        detail: {
          timer: this.fruitTimer
        }
      });
      this.removeTimer({
        detail: {
          timer: this.ghostCycleTimer
        }
      });
      this.removeTimer({
        detail: {
          timer: this.endIdleTimer
        }
      });
      this.removeTimer({
        detail: {
          timer: this.ghostFlashTimer
        }
      });
      var imgBase = 'app/style//graphics/spriteSheets/maze/';
      new Timer(function () {
        _this12.ghosts.forEach(function (ghost) {
          var ghostRef = ghost;
          ghostRef.display = false;
        });
        _this12.mazeImg.src = "".concat(imgBase, "maze_white.svg");
        new Timer(function () {
          _this12.mazeImg.src = "".concat(imgBase, "maze_blue.svg");
          new Timer(function () {
            _this12.mazeImg.src = "".concat(imgBase, "maze_white.svg");
            new Timer(function () {
              _this12.mazeImg.src = "".concat(imgBase, "maze_blue.svg");
              new Timer(function () {
                _this12.mazeImg.src = "".concat(imgBase, "maze_white.svg");
                new Timer(function () {
                  _this12.mazeImg.src = "".concat(imgBase, "maze_blue.svg");
                  new Timer(function () {
                    _this12.mazeCover.style.visibility = 'visible';
                    new Timer(function () {
                      _this12.mazeCover.style.visibility = 'hidden';
                      _this12.level += 1;
                      _this12.allowKeyPresses = true;
                      _this12.entityList.forEach(function (entity) {
                        var entityRef = entity;
                        if (entityRef.level) {
                          entityRef.level = _this12.level;
                        }
                        entityRef.reset();
                        if (entityRef instanceof Ghost) {
                          entityRef.resetDefaultSpeed();
                        }
                        if (entityRef instanceof Pickup && entityRef.type !== 'fruit') {
                          _this12.remainingDots += 1;
                        }
                      });
                      _this12.startGameplay();
                    }, 500);
                  }, 250);
                }, 250);
              }, 250);
            }, 250);
          }, 250);
        }, 250);
      }, 2000);
    }

    /**
     * Flashes ghosts blue and white to indicate the end of the powerup
     * @param {Number} flashes - Total number of elapsed flashes
     * @param {Number} maxFlashes - Total flashes to show
     */
  }, {
    key: "flashGhosts",
    value: function flashGhosts(flashes, maxFlashes) {
      var _this13 = this;
      if (flashes === maxFlashes) {
        this.scaredGhosts.forEach(function (ghost) {
          ghost.endScared();
        });
        this.scaredGhosts = [];
        if (this.eyeGhosts === 0) {
          this.soundManager.setAmbience(this.determineSiren(this.remainingDots));
        }
      } else if (this.scaredGhosts.length > 0) {
        this.scaredGhosts.forEach(function (ghost) {
          ghost.toggleScaredColor();
        });
        this.ghostFlashTimer = new Timer(function () {
          _this13.flashGhosts(flashes + 1, maxFlashes);
        }, 250);
      }
    }

    /**
     * Upon eating a power pellet, sets the ghosts to 'scared' mode
     */
  }, {
    key: "powerUp",
    value: function powerUp() {
      var _this14 = this;
      if (this.remainingDots !== 0) {
        this.soundManager.setAmbience('power_up');
      }
      this.removeTimer({
        detail: {
          timer: this.ghostFlashTimer
        }
      });
      this.ghostCombo = 0;
      this.scaredGhosts = [];
      this.ghosts.forEach(function (ghost) {
        if (ghost.mode !== 'eyes') {
          _this14.scaredGhosts.push(ghost);
        }
      });
      this.scaredGhosts.forEach(function (ghost) {
        ghost.becomeScared();
      });
      var powerDuration = Math.max((7 - this.level) * 1000, 0);
      this.ghostFlashTimer = new Timer(function () {
        _this14.flashGhosts(0, 9);
      }, powerDuration);
    }

    /**
     * Determines the quantity of points to give based on the current combo
     */
  }, {
    key: "determineComboPoints",
    value: function determineComboPoints() {
      return 100 * Math.pow(2, this.ghostCombo);
    }

    /**
     * Upon eating a ghost, award points and temporarily pause movement
     * @param {CustomEvent} e - Contains a target ghost object
     */
  }, {
    key: "eatGhost",
    value: function eatGhost(e) {
      var _this15 = this;
      var pauseDuration = 1000;
      var _e$detail$ghost = e.detail.ghost,
        position = _e$detail$ghost.position,
        measurement = _e$detail$ghost.measurement;
      this.pauseTimer({
        detail: {
          timer: this.ghostFlashTimer
        }
      });
      this.pauseTimer({
        detail: {
          timer: this.ghostCycleTimer
        }
      });
      this.pauseTimer({
        detail: {
          timer: this.fruitTimer
        }
      });
      this.soundManager.play('eat_ghost');
      this.scaredGhosts = this.scaredGhosts.filter(function (ghost) {
        return ghost.name !== e.detail.ghost.name;
      });
      this.eyeGhosts += 1;
      this.ghostCombo += 1;
      var comboPoints = this.determineComboPoints();
      window.dispatchEvent(new CustomEvent('awardPoints', {
        detail: {
          points: comboPoints
        }
      }));
      this.displayText(position, comboPoints, pauseDuration, measurement);
      this.allowPacmanMovement = false;
      this.pacman.display = false;
      this.pacman.moving = false;
      e.detail.ghost.display = false;
      e.detail.ghost.moving = false;
      this.ghosts.forEach(function (ghost) {
        var ghostRef = ghost;
        ghostRef.animate = false;
        ghostRef.pause(true);
        ghostRef.allowCollision = false;
      });
      new Timer(function () {
        _this15.soundManager.setAmbience('eyes');
        _this15.resumeTimer({
          detail: {
            timer: _this15.ghostFlashTimer
          }
        });
        _this15.resumeTimer({
          detail: {
            timer: _this15.ghostCycleTimer
          }
        });
        _this15.resumeTimer({
          detail: {
            timer: _this15.fruitTimer
          }
        });
        _this15.allowPacmanMovement = true;
        _this15.pacman.display = true;
        _this15.pacman.moving = true;
        e.detail.ghost.display = true;
        e.detail.ghost.moving = true;
        _this15.ghosts.forEach(function (ghost) {
          var ghostRef = ghost;
          ghostRef.animate = true;
          ghostRef.pause(false);
          ghostRef.allowCollision = true;
        });
      }, pauseDuration);
    }

    /**
     * Decrements the count of "eye" ghosts and updates the ambience
     */
  }, {
    key: "restoreGhost",
    value: function restoreGhost() {
      this.eyeGhosts -= 1;
      if (this.eyeGhosts === 0) {
        var sound = this.scaredGhosts.length > 0 ? 'power_up' : this.determineSiren(this.remainingDots);
        this.soundManager.setAmbience(sound);
      }
    }

    /**
     * Creates a temporary div to display points on screen
     * @param {({ left: number, top: number })} position - CSS coordinates to display the points at
     * @param {Number} amount - Amount of points to display
     * @param {Number} duration - Milliseconds to display the points before disappearing
     * @param {Number} width - Image width in pixels
     * @param {Number} height - Image height in pixels
     */
  }, {
    key: "displayText",
    value: function displayText(position, amount, duration, width, height) {
      var _this16 = this;
      var pointsDiv = document.createElement('div');
      pointsDiv.style.position = 'absolute';
      pointsDiv.style.backgroundSize = "".concat(width, "px");
      pointsDiv.style.backgroundImage = 'url(app/style/graphics/' + "spriteSheets/text/".concat(amount, ".svg");
      pointsDiv.style.width = "".concat(width, "px");
      pointsDiv.style.height = "".concat(height || width, "px");
      pointsDiv.style.top = "".concat(position.top, "px");
      pointsDiv.style.left = "".concat(position.left, "px");
      pointsDiv.style.zIndex = 2;
      this.mazeDiv.appendChild(pointsDiv);
      new Timer(function () {
        _this16.mazeDiv.removeChild(pointsDiv);
      }, duration);
    }

    /**
     * Pushes a Timer to the activeTimers array
     * @param {({ detail: { timer: Object }})} e
     */
  }, {
    key: "addTimer",
    value: function addTimer(e) {
      this.activeTimers.push(e.detail.timer);
    }

    /**
     * Checks if a Timer with a matching ID exists
     * @param {({ detail: { timer: Object }})} e
     * @returns {Boolean}
     */
  }, {
    key: "timerExists",
    value: function timerExists(e) {
      return !!(e.detail.timer || {}).timerId;
    }

    /**
     * Pauses a timer
     * @param {({ detail: { timer: Object }})} e
     */
  }, {
    key: "pauseTimer",
    value: function pauseTimer(e) {
      if (this.timerExists(e)) {
        e.detail.timer.pause(true);
      }
    }

    /**
     * Resumes a timer
     * @param {({ detail: { timer: Object }})} e
     */
  }, {
    key: "resumeTimer",
    value: function resumeTimer(e) {
      if (this.timerExists(e)) {
        e.detail.timer.resume(true);
      }
    }

    /**
     * Removes a Timer from activeTimers
     * @param {({ detail: { timer: Object }})} e
     */
  }, {
    key: "removeTimer",
    value: function removeTimer(e) {
      if (this.timerExists(e)) {
        window.clearTimeout(e.detail.timer.timerId);
        this.activeTimers = this.activeTimers.filter(function (timer) {
          return timer.timerId !== e.detail.timer.timerId;
        });
      }
    }
  }]);
}(); //Just to avoid problems with NYC coverage test
if (!process.env.NYC_PROCESS_ID) global.window.GameCoordinator = GameCoordinator;
// removeIf(production)
//module.exports = GameCoordinator;
// endRemoveIf(production)
// removeIf(production)
var _default = exports["default"] = GameCoordinator; // endRemoveIf(production)

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":9}],4:[function(require,module,exports){
(function (process,global){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var GameEngine = /*#__PURE__*/function () {
  function GameEngine(maxFps, entityList) {
    _classCallCheck(this, GameEngine);
    this.fpsDisplay = document.getElementById('fps-display');
    this.elapsedMs = 0;
    this.lastFrameTimeMs = 0;
    this.entityList = entityList;
    this.maxFps = maxFps;
    this.timestep = 1000 / this.maxFps;
    this.fps = this.maxFps;
    this.framesThisSecond = 0;
    this.lastFpsUpdate = 0;
    this.frameId = 0;
    this.running = false;
    this.started = false;
  }

  /**
   * Toggles the paused/running status of the game
   * @param {Boolean} running - Whether the game is currently in motion
   */
  return _createClass(GameEngine, [{
    key: "changePausedState",
    value: function changePausedState(running) {
      if (running) {
        this.stop();
      } else {
        this.start();
      }
    }

    /**
     * Updates the on-screen FPS counter once per second
     * @param {number} timestamp - The amount of MS which has passed since starting the game engine
     */
  }, {
    key: "updateFpsDisplay",
    value: function updateFpsDisplay(timestamp) {
      if (timestamp > this.lastFpsUpdate + 1000) {
        this.fps = (this.framesThisSecond + this.fps) / 2;
        this.lastFpsUpdate = timestamp;
        this.framesThisSecond = 0;
      }
      this.framesThisSecond += 1;
      this.fpsDisplay.textContent = "".concat(Math.round(this.fps), " FPS");
    }

    /**
     * Calls the draw function for every member of the entityList
     * @param {number} interp - The animation accuracy as a percentage
     * @param {Array} entityList - List of entities to be used throughout the game
     */
  }, {
    key: "draw",
    value: function draw(interp, entityList) {
      entityList.forEach(function (entity) {
        if (typeof entity.draw === 'function') {
          entity.draw(interp);
        }
      });
    }

    /**
     * Calls the update function for every member of the entityList
     * @param {number} elapsedMs - The amount of MS that have passed since the last update
     * @param {Array} entityList - List of entities to be used throughout the game
     */
  }, {
    key: "update",
    value: function update(elapsedMs, entityList) {
      entityList.forEach(function (entity) {
        if (typeof entity.update === 'function') {
          entity.update(elapsedMs);
        }
      });
    }

    /**
     * In the event that a ton of unsimulated frames pile up, discard all of these frames
     * to prevent crashing the game
     */
  }, {
    key: "panic",
    value: function panic() {
      this.elapsedMs = 0;
    }

    /**
     * Draws an initial frame, resets a few tracking variables related to animation, and calls
     * the mainLoop function to start the engine
     */
  }, {
    key: "start",
    value: function start() {
      var _this = this;
      if (!this.started) {
        this.started = true;
        this.frameId = requestAnimationFrame(function (firstTimestamp) {
          _this.draw(1, []);
          _this.running = true;
          _this.lastFrameTimeMs = firstTimestamp;
          _this.lastFpsUpdate = firstTimestamp;
          _this.framesThisSecond = 0;
          _this.frameId = requestAnimationFrame(function (timestamp) {
            _this.mainLoop(timestamp);
          });
        });
      }
    }

    /**
     * Stops the engine and cancels the current animation frame
     */
  }, {
    key: "stop",
    value: function stop() {
      this.running = false;
      this.started = false;
      cancelAnimationFrame(this.frameId);
    }

    /**
     * The loop which will process all necessary frames to update the game's entities
     * prior to animating them
     */
  }, {
    key: "processFrames",
    value: function processFrames() {
      var numUpdateSteps = 0;
      while (this.elapsedMs >= this.timestep) {
        this.update(this.timestep, this.entityList);
        this.elapsedMs -= this.timestep;
        numUpdateSteps += 1;
        if (numUpdateSteps >= this.maxFps) {
          this.panic();
          break;
        }
      }
    }

    /**
     * A single cycle of the engine which checks to see if enough time has passed, and, if so,
     * will kick off the loops to update and draw the game's entities.
     * @param {number} timestamp - The amount of MS which has passed since starting the game engine
     */
  }, {
    key: "engineCycle",
    value: function engineCycle(timestamp) {
      var _this2 = this;
      if (timestamp < this.lastFrameTimeMs + 1000 / this.maxFps) {
        this.frameId = requestAnimationFrame(function (nextTimestamp) {
          _this2.mainLoop(nextTimestamp);
        });
        return;
      }
      this.elapsedMs += timestamp - this.lastFrameTimeMs;
      this.lastFrameTimeMs = timestamp;
      this.updateFpsDisplay(timestamp);
      this.processFrames();
      this.draw(this.elapsedMs / this.timestep, this.entityList);
      this.frameId = requestAnimationFrame(function (nextTimestamp) {
        _this2.mainLoop(nextTimestamp);
      });
    }

    /**
     * The endless loop which will kick off engine cycles so long as the game is running
     * @param {number} timestamp - The amount of MS which has passed since starting the game engine
     */
  }, {
    key: "mainLoop",
    value: function mainLoop(timestamp) {
      this.engineCycle(timestamp);
    }
  }]);
}(); //Just to avoid problems with NYC coverage test
if (!process.env.NYC_PROCESS_ID) global.window.GameEngine = GameEngine;
// removeIf(production)
//module.exports = GameEngine;
var _default = exports["default"] = GameEngine; // endRemoveIf(production)

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":9}],5:[function(require,module,exports){
(function (process,global){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var Pickup = /*#__PURE__*/function () {
  function Pickup(type, scaledTileSize, column, row, pacman, mazeDiv, points) {
    _classCallCheck(this, Pickup);
    this.type = type;
    this.pacman = pacman;
    this.mazeDiv = mazeDiv;
    this.points = points;
    this.nearPacman = false;
    this.fruitImages = {
      100: 'cherry',
      300: 'strawberry',
      500: 'orange',
      700: 'apple',
      1000: 'melon',
      2000: 'galaxian',
      3000: 'bell',
      5000: 'key'
    };
    this.setStyleMeasurements(type, scaledTileSize, column, row, points);
  }

  /**
   * Resets the pickup's visibility
   */
  return _createClass(Pickup, [{
    key: "reset",
    value: function reset() {
      this.animationTarget.style.visibility = this.type === 'fruit' ? 'hidden' : 'visible';
    }

    /**
     * Sets various style measurements for the pickup depending on its type
     * @param {('pacdot'|'powerPellet'|'fruit')} type - The classification of pickup
     * @param {number} scaledTileSize
     * @param {number} column
     * @param {number} row
     * @param {number} points
     */
  }, {
    key: "setStyleMeasurements",
    value: function setStyleMeasurements(type, scaledTileSize, column, row, points) {
      if (type === 'pacdot') {
        this.size = scaledTileSize * 0.25;
        this.x = column * scaledTileSize + scaledTileSize / 8 * 3;
        this.y = row * scaledTileSize + scaledTileSize / 8 * 3;
      } else if (type === 'powerPellet') {
        this.size = scaledTileSize;
        this.x = column * scaledTileSize;
        this.y = row * scaledTileSize;
      } else {
        this.size = scaledTileSize * 2;
        this.x = column * scaledTileSize - scaledTileSize * 0.5;
        this.y = row * scaledTileSize - scaledTileSize * 0.5;
      }
      this.center = {
        x: column * scaledTileSize,
        y: row * scaledTileSize
      };
      this.animationTarget = document.createElement('div');
      this.animationTarget.style.position = 'absolute';
      this.animationTarget.style.backgroundSize = "".concat(this.size, "px");
      this.animationTarget.style.backgroundImage = this.determineImage(type, points);
      this.animationTarget.style.height = "".concat(this.size, "px");
      this.animationTarget.style.width = "".concat(this.size, "px");
      this.animationTarget.style.top = "".concat(this.y, "px");
      this.animationTarget.style.left = "".concat(this.x, "px");
      this.mazeDiv.appendChild(this.animationTarget);
      if (type === 'powerPellet') {
        this.animationTarget.classList.add('power-pellet');
      }
      this.reset();
    }

    /**
     * Determines the Pickup image based on type and point value
     * @param {('pacdot'|'powerPellet'|'fruit')} type - The classification of pickup
     * @param {Number} points
     * @returns {String}
     */
  }, {
    key: "determineImage",
    value: function determineImage(type, points) {
      var image = '';
      if (type === 'fruit') {
        image = this.fruitImages[points] || 'cherry';
      } else {
        image = type;
      }
      return "url(app/style/graphics/spriteSheets/pickups/".concat(image, ".svg)");
    }

    /**
     * Shows a bonus fruit, resetting its point value and image
     * @param {number} points
     */
  }, {
    key: "showFruit",
    value: function showFruit(points) {
      this.points = points;
      this.animationTarget.style.backgroundImage = this.determineImage(this.type, points);
      this.animationTarget.style.visibility = 'visible';
    }

    /**
     * Makes the fruit invisible (happens if Pacman was too slow)
     */
  }, {
    key: "hideFruit",
    value: function hideFruit() {
      this.animationTarget.style.visibility = 'hidden';
    }

    /**
     * Returns true if the Pickup is touching a bounding box at Pacman's center
     * @param {({ x: number, y: number, size: number})} pickup
     * @param {({ x: number, y: number, size: number})} originalPacman
     */
  }, {
    key: "checkForCollision",
    value: function checkForCollision(pickup, originalPacman) {
      var pacman = Object.assign({}, originalPacman);
      pacman.x += pacman.size * 0.25;
      pacman.y += pacman.size * 0.25;
      pacman.size /= 2;
      return pickup.x < pacman.x + pacman.size && pickup.x + pickup.size > pacman.x && pickup.y < pacman.y + pacman.size && pickup.y + pickup.size > pacman.y;
    }

    /**
     * Checks to see if the pickup is close enough to Pacman to be considered for collision detection
     * @param {number} maxDistance - The maximum distance Pacman can travel per cycle
     * @param {({ x:number, y:number })} pacmanCenter - The center of Pacman's hitbox
     * @param {Boolean} debugging - Flag to change the appearance of pickups for testing
     */
  }, {
    key: "checkPacmanProximity",
    value: function checkPacmanProximity(maxDistance, pacmanCenter, debugging) {
      if (this.animationTarget.style.visibility !== 'hidden') {
        var distance = Math.sqrt(Math.pow(this.center.x - pacmanCenter.x, 2) + Math.pow(this.center.y - pacmanCenter.y, 2));
        this.nearPacman = distance <= maxDistance;
        if (debugging) {
          this.animationTarget.style.background = this.nearPacman ? 'lime' : 'red';
        }
      }
    }

    /**
     * Checks if the pickup is visible and close to Pacman
     * @returns {Boolean}
     */
  }, {
    key: "shouldCheckForCollision",
    value: function shouldCheckForCollision() {
      return this.animationTarget.style.visibility !== 'hidden' && this.nearPacman;
    }

    /**
     * If the Pickup is still visible, it checks to see if it is colliding with Pacman.
     * It will turn itself invisible and cease collision-detection after the first
     * collision with Pacman.
     */
  }, {
    key: "update",
    value: function update() {
      if (this.shouldCheckForCollision()) {
        if (this.checkForCollision({
          x: this.x,
          y: this.y,
          size: this.size
        }, {
          x: this.pacman.position.left,
          y: this.pacman.position.top,
          size: this.pacman.measurement
        })) {
          this.animationTarget.style.visibility = 'hidden';
          window.dispatchEvent(new CustomEvent('awardPoints', {
            detail: {
              points: this.points,
              type: this.type
            }
          }));
          if (this.type === 'pacdot') {
            window.dispatchEvent(new Event('dotEaten'));
          } else if (this.type === 'powerPellet') {
            window.dispatchEvent(new Event('dotEaten'));
            window.dispatchEvent(new Event('powerUp'));
          }
        }
      }
    }
  }]);
}(); //Just to avoid problems with NYC coverage test
if (!process.env.NYC_PROCESS_ID) global.window.Pickup = Pickup;
// removeIf(production)
//module.exports = Pickup;
var _default = exports["default"] = Pickup; // endRemoveIf(production)

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":9}],6:[function(require,module,exports){
(function (process,global){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var CharacterUtil = /*#__PURE__*/function () {
  function CharacterUtil() {
    _classCallCheck(this, CharacterUtil);
    this.directions = {
      up: 'up',
      down: 'down',
      left: 'left',
      right: 'right'
    };
  }

  /**
   * Check if a given character has moved more than five in-game tiles during a frame.
   * If so, we want to temporarily hide the object to avoid 'animation stutter'.
   * @param {({top: number, left: number})} position - Position during the current frame
   * @param {({top: number, left: number})} oldPosition - Position during the previous frame
   * @returns {('hidden'|'visible')} - The new 'visibility' css property value for the character.
   */
  return _createClass(CharacterUtil, [{
    key: "checkForStutter",
    value: function checkForStutter(position, oldPosition) {
      var stutter = false;
      var threshold = 5;
      if (position && oldPosition) {
        if (Math.abs(position.top - oldPosition.top) > threshold || Math.abs(position.left - oldPosition.left) > threshold) {
          stutter = true;
        }
      }
      return stutter ? 'hidden' : 'visible';
    }

    /**
     * Check which CSS property needs to be changed given the character's current direction
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @returns {('top'|'left')}
     */
  }, {
    key: "getPropertyToChange",
    value: function getPropertyToChange(direction) {
      switch (direction) {
        case this.directions.up:
        case this.directions.down:
          return 'top';
        default:
          return 'left';
      }
    }

    /**
     * Calculate the velocity for the character's next frame.
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {number} velocityPerMs - The distance to travel in a single millisecond
     * @returns {number} - Moving down or right is positive, while up or left is negative.
     */
  }, {
    key: "getVelocity",
    value: function getVelocity(direction, velocityPerMs) {
      switch (direction) {
        case this.directions.up:
        case this.directions.left:
          return velocityPerMs * -1;
        default:
          return velocityPerMs;
      }
    }

    /**
     * Determine the next value which will be used to draw the character's position on screen
     * @param {number} interp - The percentage of the desired timestamp between frames
     * @param {('top'|'left')} prop - The css property to be changed
     * @param {({top: number, left: number})} oldPosition - Position during the previous frame
     * @param {({top: number, left: number})} position - Position during the current frame
     * @returns {number} - New value for css positioning
     */
  }, {
    key: "calculateNewDrawValue",
    value: function calculateNewDrawValue(interp, prop, oldPosition, position) {
      return oldPosition[prop] + (position[prop] - oldPosition[prop]) * interp;
    }

    /**
     * Convert the character's css position to a row-column on the maze array
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {number} scaledTileSize - The dimensions of a single tile
     * @returns {({x: number, y: number})}
     */
  }, {
    key: "determineGridPosition",
    value: function determineGridPosition(position, scaledTileSize) {
      return {
        x: position.left / scaledTileSize + 0.5,
        y: position.top / scaledTileSize + 0.5
      };
    }

    /**
     * Check to see if a character's disired direction results in turning around
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {('up'|'down'|'left'|'right')} desiredDirection - Character's desired orientation
     * @returns {boolean}
     */
  }, {
    key: "turningAround",
    value: function turningAround(direction, desiredDirection) {
      return desiredDirection === this.getOppositeDirection(direction);
    }

    /**
     * Calculate the opposite of a given direction
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @returns {('up'|'down'|'left'|'right')}
     */
  }, {
    key: "getOppositeDirection",
    value: function getOppositeDirection(direction) {
      switch (direction) {
        case this.directions.up:
          return this.directions.down;
        case this.directions.down:
          return this.directions.up;
        case this.directions.left:
          return this.directions.right;
        default:
          return this.directions.left;
      }
    }

    /**
     * Calculate the proper rounding function to assist with collision detection
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @returns {Function}
     */
  }, {
    key: "determineRoundingFunction",
    value: function determineRoundingFunction(direction) {
      switch (direction) {
        case this.directions.up:
        case this.directions.left:
          return Math.floor;
        default:
          return Math.ceil;
      }
    }

    /**
     * Check to see if the character's next frame results in moving to a new tile on the maze array
     * @param {({x: number, y: number})} oldPosition - Position during the previous frame
     * @param {({x: number, y: number})} position - Position during the current frame
     * @returns {boolean}
     */
  }, {
    key: "changingGridPosition",
    value: function changingGridPosition(oldPosition, position) {
      return Math.floor(oldPosition.x) !== Math.floor(position.x) || Math.floor(oldPosition.y) !== Math.floor(position.y);
    }

    /**
     * Check to see if the character is attempting to run into a wall of the maze
     * @param {({x: number, y: number})} desiredNewGridPosition - Character's target tile
     * @param {Array} mazeArray - The 2D array representing the game's maze
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @returns {boolean}
     */
  }, {
    key: "checkForWallCollision",
    value: function checkForWallCollision(desiredNewGridPosition, mazeArray, direction) {
      var roundingFunction = this.determineRoundingFunction(direction, this.directions);
      var desiredX = roundingFunction(desiredNewGridPosition.x);
      var desiredY = roundingFunction(desiredNewGridPosition.y);
      var newGridValue;
      if (Array.isArray(mazeArray[desiredY])) {
        newGridValue = mazeArray[desiredY][desiredX];
      }
      return newGridValue === 'X';
    }

    /**
     * Returns an object containing the new position and grid position based upon a direction
     * @param {({top: number, left: number})} position - css position during the current frame
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {number} velocityPerMs - The distance to travel in a single millisecond
     * @param {number} elapsedMs - The amount of MS that have passed since the last update
     * @param {number} scaledTileSize - The dimensions of a single tile
     * @returns {object}
     */
  }, {
    key: "determineNewPositions",
    value: function determineNewPositions(position, direction, velocityPerMs, elapsedMs, scaledTileSize) {
      var newPosition = Object.assign({}, position);
      newPosition[this.getPropertyToChange(direction)] += this.getVelocity(direction, velocityPerMs) * elapsedMs;
      var newGridPosition = this.determineGridPosition(newPosition, scaledTileSize);
      return {
        newPosition: newPosition,
        newGridPosition: newGridPosition
      };
    }

    /**
     * Calculates the css position when snapping the character to the x-y grid
     * @param {({x: number, y: number})} position - The character's position during the current frame
     * @param {('up'|'down'|'left'|'right')} direction - The character's current travel orientation
     * @param {number} scaledTileSize - The dimensions of a single tile
     * @returns {({top: number, left: number})}
     */
  }, {
    key: "snapToGrid",
    value: function snapToGrid(position, direction, scaledTileSize) {
      var newPosition = Object.assign({}, position);
      var roundingFunction = this.determineRoundingFunction(direction, this.directions);
      switch (direction) {
        case this.directions.up:
        case this.directions.down:
          newPosition.y = roundingFunction(newPosition.y);
          break;
        default:
          newPosition.x = roundingFunction(newPosition.x);
          break;
      }
      return {
        top: (newPosition.y - 0.5) * scaledTileSize,
        left: (newPosition.x - 0.5) * scaledTileSize
      };
    }

    /**
     * Returns a modified position if the character needs to warp
     * @param {({top: number, left: number})} position - css position during the current frame
     * @param {({x: number, y: number})} gridPosition - x-y position during the current frame
     * @param {number} scaledTileSize - The dimensions of a single tile
     * @returns {({top: number, left: number})}
     */
  }, {
    key: "handleWarp",
    value: function handleWarp(position, scaledTileSize, mazeArray) {
      var newPosition = Object.assign({}, position);
      var gridPosition = this.determineGridPosition(position, scaledTileSize);
      if (gridPosition.x < -0.75) {
        newPosition.left = scaledTileSize * (mazeArray[0].length - 0.75);
      } else if (gridPosition.x > mazeArray[0].length - 0.25) {
        newPosition.left = scaledTileSize * -1.25;
      }
      return newPosition;
    }

    /**
     * Advances spritesheet by one frame if needed
     * @param {Object} character - The character which needs to be animated
     */
  }, {
    key: "advanceSpriteSheet",
    value: function advanceSpriteSheet(character) {
      var msSinceLastSprite = character.msSinceLastSprite,
        animationTarget = character.animationTarget,
        backgroundOffsetPixels = character.backgroundOffsetPixels;
      var updatedProperties = {
        msSinceLastSprite: msSinceLastSprite,
        animationTarget: animationTarget,
        backgroundOffsetPixels: backgroundOffsetPixels
      };
      var ready = character.msSinceLastSprite > character.msBetweenSprites && character.animate;
      if (ready) {
        updatedProperties.msSinceLastSprite = 0;
        if (character.backgroundOffsetPixels < character.measurement * (character.spriteFrames - 1)) {
          updatedProperties.backgroundOffsetPixels += character.measurement;
        } else if (character.loopAnimation) {
          updatedProperties.backgroundOffsetPixels = 0;
        }
        var style = "-".concat(updatedProperties.backgroundOffsetPixels, "px 0px");
        updatedProperties.animationTarget.style.backgroundPosition = style;
      }
      return updatedProperties;
    }
  }]);
}(); //Just to avoid problems with NYC coverage test
if (!process.env.NYC_PROCESS_ID) global.window.CharacterUtil = CharacterUtil;

// removeIf(production)
// if (typeof module != undefined)
//   module.exports = CharacterUtil;
var _default = exports["default"] = CharacterUtil; // endRemoveIf(production)

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":9}],7:[function(require,module,exports){
(function (process,global){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _regenerator() {
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */var e,
    t,
    r = "function" == typeof Symbol ? Symbol : {},
    n = r.iterator || "@@iterator",
    o = r.toStringTag || "@@toStringTag";
  function i(r, n, o, i) {
    var c = n && n.prototype instanceof Generator ? n : Generator,
      u = Object.create(c.prototype);
    return _regeneratorDefine2(u, "_invoke", function (r, n, o) {
      var i,
        c,
        u,
        f = 0,
        p = o || [],
        y = !1,
        G = {
          p: 0,
          n: 0,
          v: e,
          a: d,
          f: d.bind(e, 4),
          d: function d(t, r) {
            return i = t, c = 0, u = e, G.n = r, a;
          }
        };
      function d(r, n) {
        for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) {
          var o,
            i = p[t],
            d = G.p,
            l = i[2];
          r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0));
        }
        if (o || r > 1) return a;
        throw y = !0, n;
      }
      return function (o, p, l) {
        if (f > 1) throw TypeError("Generator is already running");
        for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) {
          i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u);
          try {
            if (f = 2, i) {
              if (c || (o = "next"), t = i[o]) {
                if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object");
                if (!t.done) return t;
                u = t.value, c < 2 && (c = 0);
              } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1);
              i = e;
            } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break;
          } catch (t) {
            i = e, c = 1, u = t;
          } finally {
            f = 1;
          }
        }
        return {
          value: t,
          done: y
        };
      };
    }(r, o, i), !0), u;
  }
  var a = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  t = Object.getPrototypeOf;
  var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () {
      return this;
    }), t),
    u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c);
  function f(e) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e;
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () {
    return this;
  }), _regeneratorDefine2(u, "toString", function () {
    return "[object Generator]";
  }), (_regenerator = function _regenerator() {
    return {
      w: i,
      m: f
    };
  })();
}
function _regeneratorDefine2(e, r, n, t) {
  var i = Object.defineProperty;
  try {
    i({}, "", {});
  } catch (e) {
    i = 0;
  }
  _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) {
    function o(r, n) {
      _regeneratorDefine2(e, r, function (e) {
        return this._invoke(r, n, e);
      });
    }
    r ? i ? i(e, r, {
      value: n,
      enumerable: !t,
      configurable: !t,
      writable: !t
    }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2));
  }, _regeneratorDefine2(e, r, n, t);
}
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var SoundManager = /*#__PURE__*/function () {
  function SoundManager() {
    _classCallCheck(this, SoundManager);
    this.baseUrl = 'app/style/audio/';
    this.fileFormat = 'mp3';
    this.masterVolume = 1;
    this.paused = false;
    this.cutscene = true;
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ambience = new AudioContext();
  }

  /**
   * Sets the cutscene flag to determine if players should be able to resume ambience
   * @param {Boolean} newValue
   */
  return _createClass(SoundManager, [{
    key: "setCutscene",
    value: function setCutscene(newValue) {
      this.cutscene = newValue;
    }

    /**
     * Sets the master volume for all sounds and stops/resumes ambience
     * @param {(0|1)} newVolume
     */
  }, {
    key: "setMasterVolume",
    value: function setMasterVolume(newVolume) {
      this.masterVolume = newVolume;
      if (this.soundEffect) {
        this.soundEffect.volume = this.masterVolume;
      }
      if (this.dotPlayer) {
        this.dotPlayer.volume = this.masterVolume;
      }
      if (this.masterVolume === 0) {
        this.stopAmbience();
      } else {
        this.resumeAmbience(this.paused);
      }
    }

    /**
     * Plays a single sound effect
     * @param {String} sound
     */
  }, {
    key: "play",
    value: function play(sound) {
      this.soundEffect = new Audio("".concat(this.baseUrl).concat(sound, ".").concat(this.fileFormat));
      this.soundEffect.volume = this.masterVolume;
      this.soundEffect.play();
    }

    /**
     * Special method for eating dots. The dots should alternate between two
     * sound effects, but not too quickly.
     */
  }, {
    key: "playDotSound",
    value: function playDotSound() {
      this.queuedDotSound = true;
      if (!this.dotPlayer) {
        this.queuedDotSound = false;
        this.dotSound = this.dotSound === 1 ? 2 : 1;
        this.dotPlayer = new Audio("".concat(this.baseUrl, "dot_").concat(this.dotSound, ".").concat(this.fileFormat));
        this.dotPlayer.onended = this.dotSoundEnded.bind(this);
        this.dotPlayer.volume = this.masterVolume;
        this.dotPlayer.play();
      }
    }

    /**
     * Deletes the dotSound player and plays another dot sound if needed
     */
  }, {
    key: "dotSoundEnded",
    value: function dotSoundEnded() {
      this.dotPlayer = undefined;
      if (this.queuedDotSound) {
        this.playDotSound();
      }
    }

    /**
     * Loops an ambient sound
     * @param {String} sound
     */
  }, {
    key: "setAmbience",
    value: function () {
      var _setAmbience = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(sound, keepCurrentAmbience) {
        var response, arrayBuffer, audioBuffer;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              if (!(!this.fetchingAmbience && !this.cutscene)) {
                _context.n = 4;
                break;
              }
              if (!keepCurrentAmbience) {
                this.currentAmbience = sound;
                this.paused = false;
              } else {
                this.paused = true;
              }
              if (this.ambienceSource) {
                this.ambienceSource.stop();
              }
              if (!(this.masterVolume !== 0)) {
                _context.n = 4;
                break;
              }
              this.fetchingAmbience = true;
              _context.n = 1;
              return fetch("".concat(this.baseUrl).concat(sound, ".").concat(this.fileFormat));
            case 1:
              response = _context.v;
              _context.n = 2;
              return response.arrayBuffer();
            case 2:
              arrayBuffer = _context.v;
              _context.n = 3;
              return this.ambience.decodeAudioData(arrayBuffer);
            case 3:
              audioBuffer = _context.v;
              this.ambienceSource = this.ambience.createBufferSource();
              this.ambienceSource.buffer = audioBuffer;
              this.ambienceSource.connect(this.ambience.destination);
              this.ambienceSource.loop = true;
              this.ambienceSource.start();
              this.fetchingAmbience = false;
            case 4:
              return _context.a(2);
          }
        }, _callee, this);
      }));
      function setAmbience(_x, _x2) {
        return _setAmbience.apply(this, arguments);
      }
      return setAmbience;
    }()
    /**
     * Resumes the ambience
     */
  }, {
    key: "resumeAmbience",
    value: function resumeAmbience(paused) {
      if (this.ambienceSource) {
        // Resetting the ambience since an AudioBufferSourceNode can only
        // have 'start()' called once
        if (paused) {
          this.setAmbience('pause_beat', true);
        } else {
          this.setAmbience(this.currentAmbience);
        }
      }
    }

    /**
     * Stops the ambience
     */
  }, {
    key: "stopAmbience",
    value: function stopAmbience() {
      if (this.ambienceSource) {
        this.ambienceSource.stop();
      }
    }
  }]);
}(); //Just to avoid problems with NYC coverage test
if (!process.env.NYC_PROCESS_ID) global.window.SoundManager = SoundManager;
// removeIf(production)
//module.exports = SoundManager;
var _default = exports["default"] = SoundManager; // endRemoveIf(production)

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":9}],8:[function(require,module,exports){
(function (process,global){(function (){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var Timer = /*#__PURE__*/function () {
  function Timer(callback, delay) {
    _classCallCheck(this, Timer);
    this.callback = callback;
    this.remaining = delay;
    this.resume();
  }

  /**
   * Pauses the timer marks whether the pause came from the player
   * or the system
   * @param {Boolean} systemPause
   */
  return _createClass(Timer, [{
    key: "pause",
    value: function pause(systemPause) {
      window.clearTimeout(this.timerId);
      this.remaining -= new Date() - this.start;
      this.oldTimerId = this.timerId;
      if (systemPause) {
        this.pausedBySystem = true;
      }
    }

    /**
     * Creates a new setTimeout based upon the remaining time, giving the
     * illusion of 'resuming' the old setTimeout
     * @param {Boolean} systemResume
     */
  }, {
    key: "resume",
    value: function resume(systemResume) {
      var _this = this;
      if (systemResume || !this.pausedBySystem) {
        this.pausedBySystem = false;
        this.start = new Date();
        this.timerId = window.setTimeout(function () {
          _this.callback();
          window.dispatchEvent(new CustomEvent('removeTimer', {
            detail: {
              timer: _this
            }
          }));
        }, this.remaining);
        if (!this.oldTimerId) {
          window.dispatchEvent(new CustomEvent('addTimer', {
            detail: {
              timer: this
            }
          }));
        }
      }
    }
  }]);
}(); //Just to avoid problems with NYC coverage test
if (!process.env.NYC_PROCESS_ID) global.window.Timer = Timer;
// removeIf(production)
//module.exports = Timer;
var _default = exports["default"] = Timer; // endRemoveIf(production)

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":9}],9:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1,2,3,4,5,6,7,8]);
