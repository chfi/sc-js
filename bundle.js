(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

exports.Curve = Curve;

var Curve = function () {
    function Curve(x, y, ang, curve) {
        _classCallCheck(this, Curve);

        this.x = x;
        this.y = y;

        this.ang = ang;
        this.angSpeed = gameDefinition.baseTurnSpeed;

        this.speed = gameDefinition.baseSpeed;

        this.tail = [{ x: x, y: y }];

        this.color = "red";
    }

    _createClass(Curve, [{
        key: "update",
        value: function update(dt) {
            this.x += Math.cos(this.ang) * this.speed * dt;
            this.y += Math.sin(this.ang) * this.speed * dt;

            var tailHead = this.tail[0];

            if (Math.hypot(this.x - tailHead.x, this.y - tailHead.y) > gameDefinition.tailDistance) {
                this.tail.unshift({ x: this.x, y: this.y });
            }
        }
    }, {
        key: "setAngularVelocity",
        value: function setAngularVelocity(keys, dt) {
            if (keys.right) {
                this.ang += this.angSpeed * dt;
            } else if (keys.left) {
                this.ang -= this.angSpeed * dt;
            } else {
                this.ang = 0;
            }
        }
    }, {
        key: "getSafeTail",
        value: function getSafeTail() {
            var _this = this;

            var firstSafe = this.tail.findIndex(function (t) {
                return Math.hypot(_this.x - t.x, _this.y - t.y) > gameDefinition.tailDistance;
            });
            return typeof firstSafe === "number" ? this.tail.slice(firstSafe) : [];
        }
    }, {
        key: "collide",
        value: function collide(otherTail) {
            var _this2 = this;

            return otherTail.some(function (t) {
                return Math.hypot(_this2.x - t.x, _this2.y - t.y) < gameDefinition.tailDistance;
            });
        }
    }]);

    return Curve;
}();

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.drawGame = undefined;

var _gameDefinition = require("./gameDefinition.js");

exports.drawGame = drawGame;

function drawCircle(ctx, _ref, r) {
    var x = _ref.x,
        y = _ref.y;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawCurve(ctx, curve) {
    ctx.save();
    curve.tail.forEach(function (t) {
        return drawCircle(ctx, t, _gameDefinition.gameDefinition.baseRadius);
    });
    drawCircle(ctx, { x: curve.x, y: curve.y }, _gameDefinition.gameDefinition.baseRadius);
    ctx.restore();
}

function drawGame(ctx, curves) {
    // TODO: game size should be set somewhere else
    ctx.clearRect(0, 0, 500, 500);
    curves.forEach(function (c) {
        return drawCurve(ctx, c);
    });
}

},{"./gameDefinition.js":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gameDefinition = gameDefinition;

var gameDefinition = { baseSpeed: 100,
  baseRadius: 5,
  baseTurnSpeed: Math.PI,
  tailDistance: 3
};

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

exports.KeyMapping = KeyMapping;
exports.adMapping = adMapping;
exports.fgMapping = fgMapping;
exports.arrowsMapping = arrowsMapping;

var KeyMapping = function () {
    function KeyMapping(left, right) {
        _classCallCheck(this, KeyMapping);

        this.left = left;
        this.right = right;
    }

    _createClass(KeyMapping, [{
        key: "keyDown",
        value: function keyDown(e) {
            if (e.keyCode === this.left) {
                this.left = true;
            } else if (e.keyCode === this.right) {
                this.right = true;
            }
        }
    }, {
        key: "keyUp",
        value: function keyUp(e) {
            if (e.keyCode === this.left) {
                this.left = false;
            } else if (e.keyCode === this.right) {
                this.right = false;
            }
        }
    }]);

    return KeyMapping;
}();

;

var adMapping = new KeyMapping();

var fgMapping = new KeyMapping();

var arrowsMapping = new KeyMapping(37, 39);

},{}],5:[function(require,module,exports){
"use strict";

var _curve = require("./curve");

var _player = require("./player");

var _input = require("./input");

var Input = _interopRequireWildcard(_input);

var _draw = require("./draw");

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

// const p = new Player(200, 200, 0);
/* jshint esversion: 6 */

// import * as Player from "./player.js";
// import * as Curve from "./curve.js";
console.log(_player);
var c = new _curve.Curve(200, 200, 0);
// const m = new Input.KeyMapping()
var p = new _player.Player(c, Input.adMapping);
var keys = { left: false, right: false, up: false, down: false };
var state = { time: 0 };

function update(frameTime, p, keys) {
    // convert dt to seconds
    var dt = (frameTime - state.time) * 0.001;
    state.time = frameTime;
    p.update(dt);
    // c.setAngularVelocity(keys, dt);
    // p.update(dt);
}

// function draw(ctx, s) {
// TODO fix magic numbers
// ctx.clearRect(0, 0, 500, 500);
// p.draw(ctx);

// drawGame(ctx, [p]);
// drawCircle(ctx, p, 10);
// }

function step(dt, ctx, p, keys) {
    update(dt, p, keys);
    (0, _draw.drawGame)(ctx, [p.curve]);
    window.requestAnimationFrame(function (dt) {
        return step(dt, ctx, p, keys);
    });
}

window.onload = function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    // document.addEventListener("keydown", keyDownHandler, false);
    // document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("keydown", p.mapping.keyDown, false);
    document.addEventListener("keyup", p.mapping.keyUp, false);

    window.requestAnimationFrame(function (dt) {
        return step(dt, ctx, p, keys);
    });
};

},{"./curve":1,"./draw":2,"./input":4,"./player":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

exports.Player = Player;

var Player = function () {
    function Player(curve, mapping) {
        _classCallCheck(this, Player);

        this.curve = curve;
        this.mapping = mapping;
        this.input = { left: false, right: false };
    }

    _createClass(Player, [{
        key: "update",
        value: function update(dt) {
            this.curve.setAngularVelocity(this.input, dt);
        }
    }, {
        key: "addListeners",
        value: function addListeners() {
            document.addEventListener("keydown", this.mapping.keyDown, false);
            document.addEventListener("keyup", this.mapping.keyUp, false);
        }
    }]);

    return Player;
}();

},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9jdXJ2ZS5qcyIsInNyYy9kcmF3LmpzIiwic3JjL2dhbWVEZWZpbml0aW9uLmpzIiwic3JjL2lucHV0LmpzIiwic3JjL21haW4uanMiLCJzcmMvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FBRUEsT0FBTyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQ3pDLFdBQU87QUFEa0MsQ0FBN0M7O0FBSUEsSUFBSSxlQUFlLFlBQVk7QUFBRSxhQUFTLGdCQUFULENBQTBCLE1BQTFCLEVBQWtDLEtBQWxDLEVBQXlDO0FBQUUsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sTUFBMUIsRUFBa0MsR0FBbEMsRUFBdUM7QUFBRSxnQkFBSSxhQUFhLE1BQU0sQ0FBTixDQUFqQixDQUEyQixXQUFXLFVBQVgsR0FBd0IsV0FBVyxVQUFYLElBQXlCLEtBQWpELENBQXdELFdBQVcsWUFBWCxHQUEwQixJQUExQixDQUFnQyxJQUFJLFdBQVcsVUFBZixFQUEyQixXQUFXLFFBQVgsR0FBc0IsSUFBdEIsQ0FBNEIsT0FBTyxjQUFQLENBQXNCLE1BQXRCLEVBQThCLFdBQVcsR0FBekMsRUFBOEMsVUFBOUM7QUFBNEQ7QUFBRSxLQUFDLE9BQU8sVUFBVSxXQUFWLEVBQXVCLFVBQXZCLEVBQW1DLFdBQW5DLEVBQWdEO0FBQUUsWUFBSSxVQUFKLEVBQWdCLGlCQUFpQixZQUFZLFNBQTdCLEVBQXdDLFVBQXhDLEVBQXFELElBQUksV0FBSixFQUFpQixpQkFBaUIsV0FBakIsRUFBOEIsV0FBOUIsRUFBNEMsT0FBTyxXQUFQO0FBQXFCLEtBQWhOO0FBQW1OLENBQTloQixFQUFuQjs7QUFFQSxTQUFTLGVBQVQsQ0FBeUIsUUFBekIsRUFBbUMsV0FBbkMsRUFBZ0Q7QUFBRSxRQUFJLEVBQUUsb0JBQW9CLFdBQXRCLENBQUosRUFBd0M7QUFBRSxjQUFNLElBQUksU0FBSixDQUFjLG1DQUFkLENBQU47QUFBMkQ7QUFBRTs7QUFFekosUUFBUSxLQUFSLEdBQWdCLEtBQWhCOztBQUVBLElBQUksUUFBUSxZQUFZO0FBQ3BCLGFBQVMsS0FBVCxDQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUIsR0FBckIsRUFBMEIsS0FBMUIsRUFBaUM7QUFDN0Isd0JBQWdCLElBQWhCLEVBQXNCLEtBQXRCOztBQUVBLGFBQUssQ0FBTCxHQUFTLENBQVQ7QUFDQSxhQUFLLENBQUwsR0FBUyxDQUFUOztBQUVBLGFBQUssR0FBTCxHQUFXLEdBQVg7QUFDQSxhQUFLLFFBQUwsR0FBZ0IsZUFBZSxhQUEvQjs7QUFFQSxhQUFLLEtBQUwsR0FBYSxlQUFlLFNBQTVCOztBQUVBLGFBQUssSUFBTCxHQUFZLENBQUMsRUFBRSxHQUFHLENBQUwsRUFBUSxHQUFHLENBQVgsRUFBRCxDQUFaOztBQUVBLGFBQUssS0FBTCxHQUFhLEtBQWI7QUFDSDs7QUFFRCxpQkFBYSxLQUFiLEVBQW9CLENBQUM7QUFDakIsYUFBSyxRQURZO0FBRWpCLGVBQU8sU0FBUyxNQUFULENBQWdCLEVBQWhCLEVBQW9CO0FBQ3ZCLGlCQUFLLENBQUwsSUFBVSxLQUFLLEdBQUwsQ0FBUyxLQUFLLEdBQWQsSUFBcUIsS0FBSyxLQUExQixHQUFrQyxFQUE1QztBQUNBLGlCQUFLLENBQUwsSUFBVSxLQUFLLEdBQUwsQ0FBUyxLQUFLLEdBQWQsSUFBcUIsS0FBSyxLQUExQixHQUFrQyxFQUE1Qzs7QUFFQSxnQkFBSSxXQUFXLEtBQUssSUFBTCxDQUFVLENBQVYsQ0FBZjs7QUFFQSxnQkFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFLLENBQUwsR0FBUyxTQUFTLENBQTdCLEVBQWdDLEtBQUssQ0FBTCxHQUFTLFNBQVMsQ0FBbEQsSUFBdUQsZUFBZSxZQUExRSxFQUF3RjtBQUNwRixxQkFBSyxJQUFMLENBQVUsT0FBVixDQUFrQixFQUFFLEdBQUcsS0FBSyxDQUFWLEVBQWEsR0FBRyxLQUFLLENBQXJCLEVBQWxCO0FBQ0g7QUFDSjtBQVhnQixLQUFELEVBWWpCO0FBQ0MsYUFBSyxvQkFETjtBQUVDLGVBQU8sU0FBUyxrQkFBVCxDQUE0QixJQUE1QixFQUFrQyxFQUFsQyxFQUFzQztBQUN6QyxnQkFBSSxLQUFLLEtBQVQsRUFBZ0I7QUFDWixxQkFBSyxHQUFMLElBQVksS0FBSyxRQUFMLEdBQWdCLEVBQTVCO0FBQ0gsYUFGRCxNQUVPLElBQUksS0FBSyxJQUFULEVBQWU7QUFDbEIscUJBQUssR0FBTCxJQUFZLEtBQUssUUFBTCxHQUFnQixFQUE1QjtBQUNILGFBRk0sTUFFQTtBQUNILHFCQUFLLEdBQUwsR0FBVyxDQUFYO0FBQ0g7QUFDSjtBQVZGLEtBWmlCLEVBdUJqQjtBQUNDLGFBQUssYUFETjtBQUVDLGVBQU8sU0FBUyxXQUFULEdBQXVCO0FBQzFCLGdCQUFJLFFBQVEsSUFBWjs7QUFFQSxnQkFBSSxZQUFZLEtBQUssSUFBTCxDQUFVLFNBQVYsQ0FBb0IsVUFBVSxDQUFWLEVBQWE7QUFDN0MsdUJBQU8sS0FBSyxLQUFMLENBQVcsTUFBTSxDQUFOLEdBQVUsRUFBRSxDQUF2QixFQUEwQixNQUFNLENBQU4sR0FBVSxFQUFFLENBQXRDLElBQTJDLGVBQWUsWUFBakU7QUFDSCxhQUZlLENBQWhCO0FBR0EsbUJBQU8sT0FBTyxTQUFQLEtBQXFCLFFBQXJCLEdBQWdDLEtBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsU0FBaEIsQ0FBaEMsR0FBNkQsRUFBcEU7QUFDSDtBQVRGLEtBdkJpQixFQWlDakI7QUFDQyxhQUFLLFNBRE47QUFFQyxlQUFPLFNBQVMsT0FBVCxDQUFpQixTQUFqQixFQUE0QjtBQUMvQixnQkFBSSxTQUFTLElBQWI7O0FBRUEsbUJBQU8sVUFBVSxJQUFWLENBQWUsVUFBVSxDQUFWLEVBQWE7QUFDL0IsdUJBQU8sS0FBSyxLQUFMLENBQVcsT0FBTyxDQUFQLEdBQVcsRUFBRSxDQUF4QixFQUEyQixPQUFPLENBQVAsR0FBVyxFQUFFLENBQXhDLElBQTZDLGVBQWUsWUFBbkU7QUFDSCxhQUZNLENBQVA7QUFHSDtBQVJGLEtBakNpQixDQUFwQjs7QUE0Q0EsV0FBTyxLQUFQO0FBQ0gsQ0E5RFcsRUFBWjs7O0FDWkE7O0FBRUEsT0FBTyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQ3pDLFdBQU87QUFEa0MsQ0FBN0M7QUFHQSxRQUFRLFFBQVIsR0FBbUIsU0FBbkI7O0FBRUEsSUFBSSxrQkFBa0IsUUFBUSxxQkFBUixDQUF0Qjs7QUFFQSxRQUFRLFFBQVIsR0FBbUIsUUFBbkI7O0FBR0EsU0FBUyxVQUFULENBQW9CLEdBQXBCLEVBQXlCLElBQXpCLEVBQStCLENBQS9CLEVBQWtDO0FBQzlCLFFBQUksSUFBSSxLQUFLLENBQWI7QUFBQSxRQUNJLElBQUksS0FBSyxDQURiOztBQUdBLFFBQUksSUFBSjtBQUNBLFFBQUksU0FBSjtBQUNBLFFBQUksR0FBSixDQUFRLENBQVIsRUFBVyxDQUFYLEVBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixLQUFLLEVBQUwsR0FBVSxDQUE5QjtBQUNBLFFBQUksU0FBSjtBQUNBLFFBQUksSUFBSjtBQUNBLFFBQUksT0FBSjtBQUNIOztBQUVELFNBQVMsU0FBVCxDQUFtQixHQUFuQixFQUF3QixLQUF4QixFQUErQjtBQUMzQixRQUFJLElBQUo7QUFDQSxVQUFNLElBQU4sQ0FBVyxPQUFYLENBQW1CLFVBQVUsQ0FBVixFQUFhO0FBQzVCLGVBQU8sV0FBVyxHQUFYLEVBQWdCLENBQWhCLEVBQW1CLGdCQUFnQixjQUFoQixDQUErQixVQUFsRCxDQUFQO0FBQ0gsS0FGRDtBQUdBLGVBQVcsR0FBWCxFQUFnQixFQUFFLEdBQUcsTUFBTSxDQUFYLEVBQWMsR0FBRyxNQUFNLENBQXZCLEVBQWhCLEVBQTRDLGdCQUFnQixjQUFoQixDQUErQixVQUEzRTtBQUNBLFFBQUksT0FBSjtBQUNIOztBQUVELFNBQVMsUUFBVCxDQUFrQixHQUFsQixFQUF1QixNQUF2QixFQUErQjtBQUMzQjtBQUNBLFFBQUksU0FBSixDQUFjLENBQWQsRUFBaUIsQ0FBakIsRUFBb0IsR0FBcEIsRUFBeUIsR0FBekI7QUFDQSxXQUFPLE9BQVAsQ0FBZSxVQUFVLENBQVYsRUFBYTtBQUN4QixlQUFPLFVBQVUsR0FBVixFQUFlLENBQWYsQ0FBUDtBQUNILEtBRkQ7QUFHSDs7O0FDdkNEOztBQUVBLE9BQU8sY0FBUCxDQUFzQixPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUMzQyxTQUFPO0FBRG9DLENBQTdDO0FBR0EsUUFBUSxjQUFSLEdBQXlCLGNBQXpCOztBQUdBLElBQUksaUJBQWlCLEVBQUUsV0FBVyxHQUFiO0FBQ25CLGNBQVksQ0FETztBQUVuQixpQkFBZSxLQUFLLEVBRkQ7QUFHbkIsZ0JBQWM7QUFISyxDQUFyQjs7O0FDUkE7O0FBRUEsT0FBTyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQ3pDLFdBQU87QUFEa0MsQ0FBN0M7O0FBSUEsSUFBSSxlQUFlLFlBQVk7QUFBRSxhQUFTLGdCQUFULENBQTBCLE1BQTFCLEVBQWtDLEtBQWxDLEVBQXlDO0FBQUUsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sTUFBMUIsRUFBa0MsR0FBbEMsRUFBdUM7QUFBRSxnQkFBSSxhQUFhLE1BQU0sQ0FBTixDQUFqQixDQUEyQixXQUFXLFVBQVgsR0FBd0IsV0FBVyxVQUFYLElBQXlCLEtBQWpELENBQXdELFdBQVcsWUFBWCxHQUEwQixJQUExQixDQUFnQyxJQUFJLFdBQVcsVUFBZixFQUEyQixXQUFXLFFBQVgsR0FBc0IsSUFBdEIsQ0FBNEIsT0FBTyxjQUFQLENBQXNCLE1BQXRCLEVBQThCLFdBQVcsR0FBekMsRUFBOEMsVUFBOUM7QUFBNEQ7QUFBRSxLQUFDLE9BQU8sVUFBVSxXQUFWLEVBQXVCLFVBQXZCLEVBQW1DLFdBQW5DLEVBQWdEO0FBQUUsWUFBSSxVQUFKLEVBQWdCLGlCQUFpQixZQUFZLFNBQTdCLEVBQXdDLFVBQXhDLEVBQXFELElBQUksV0FBSixFQUFpQixpQkFBaUIsV0FBakIsRUFBOEIsV0FBOUIsRUFBNEMsT0FBTyxXQUFQO0FBQXFCLEtBQWhOO0FBQW1OLENBQTloQixFQUFuQjs7QUFFQSxTQUFTLGVBQVQsQ0FBeUIsUUFBekIsRUFBbUMsV0FBbkMsRUFBZ0Q7QUFBRSxRQUFJLEVBQUUsb0JBQW9CLFdBQXRCLENBQUosRUFBd0M7QUFBRSxjQUFNLElBQUksU0FBSixDQUFjLG1DQUFkLENBQU47QUFBMkQ7QUFBRTs7QUFFekosUUFBUSxVQUFSLEdBQXFCLFVBQXJCO0FBQ0EsUUFBUSxTQUFSLEdBQW9CLFNBQXBCO0FBQ0EsUUFBUSxTQUFSLEdBQW9CLFNBQXBCO0FBQ0EsUUFBUSxhQUFSLEdBQXdCLGFBQXhCOztBQUVBLElBQUksYUFBYSxZQUFZO0FBQ3pCLGFBQVMsVUFBVCxDQUFvQixJQUFwQixFQUEwQixLQUExQixFQUFpQztBQUM3Qix3QkFBZ0IsSUFBaEIsRUFBc0IsVUFBdEI7O0FBRUEsYUFBSyxJQUFMLEdBQVksSUFBWjtBQUNBLGFBQUssS0FBTCxHQUFhLEtBQWI7QUFDSDs7QUFFRCxpQkFBYSxVQUFiLEVBQXlCLENBQUM7QUFDdEIsYUFBSyxTQURpQjtBQUV0QixlQUFPLFNBQVMsT0FBVCxDQUFpQixDQUFqQixFQUFvQjtBQUN2QixnQkFBSSxFQUFFLE9BQUYsS0FBYyxLQUFLLElBQXZCLEVBQTZCO0FBQ3pCLHFCQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0gsYUFGRCxNQUVPLElBQUksRUFBRSxPQUFGLEtBQWMsS0FBSyxLQUF2QixFQUE4QjtBQUNqQyxxQkFBSyxLQUFMLEdBQWEsSUFBYjtBQUNIO0FBQ0o7QUFScUIsS0FBRCxFQVN0QjtBQUNDLGFBQUssT0FETjtBQUVDLGVBQU8sU0FBUyxLQUFULENBQWUsQ0FBZixFQUFrQjtBQUNyQixnQkFBSSxFQUFFLE9BQUYsS0FBYyxLQUFLLElBQXZCLEVBQTZCO0FBQ3pCLHFCQUFLLElBQUwsR0FBWSxLQUFaO0FBQ0gsYUFGRCxNQUVPLElBQUksRUFBRSxPQUFGLEtBQWMsS0FBSyxLQUF2QixFQUE4QjtBQUNqQyxxQkFBSyxLQUFMLEdBQWEsS0FBYjtBQUNIO0FBQ0o7QUFSRixLQVRzQixDQUF6Qjs7QUFvQkEsV0FBTyxVQUFQO0FBQ0gsQ0E3QmdCLEVBQWpCOztBQStCQTs7QUFFQSxJQUFJLFlBQVksSUFBSSxVQUFKLEVBQWhCOztBQUVBLElBQUksWUFBWSxJQUFJLFVBQUosRUFBaEI7O0FBRUEsSUFBSSxnQkFBZ0IsSUFBSSxVQUFKLENBQWUsRUFBZixFQUFtQixFQUFuQixDQUFwQjs7O0FDcERBOztBQUVBLElBQUksU0FBUyxRQUFRLFNBQVIsQ0FBYjs7QUFFQSxJQUFJLFVBQVUsUUFBUSxVQUFSLENBQWQ7O0FBRUEsSUFBSSxTQUFTLFFBQVEsU0FBUixDQUFiOztBQUVBLElBQUksUUFBUSx3QkFBd0IsTUFBeEIsQ0FBWjs7QUFFQSxJQUFJLFFBQVEsUUFBUSxRQUFSLENBQVo7O0FBRUEsU0FBUyx1QkFBVCxDQUFpQyxHQUFqQyxFQUFzQztBQUFFLFFBQUksT0FBTyxJQUFJLFVBQWYsRUFBMkI7QUFBRSxlQUFPLEdBQVA7QUFBYSxLQUExQyxNQUFnRDtBQUFFLFlBQUksU0FBUyxFQUFiLENBQWlCLElBQUksT0FBTyxJQUFYLEVBQWlCO0FBQUUsaUJBQUssSUFBSSxHQUFULElBQWdCLEdBQWhCLEVBQXFCO0FBQUUsb0JBQUksT0FBTyxTQUFQLENBQWlCLGNBQWpCLENBQWdDLElBQWhDLENBQXFDLEdBQXJDLEVBQTBDLEdBQTFDLENBQUosRUFBb0QsT0FBTyxHQUFQLElBQWMsSUFBSSxHQUFKLENBQWQ7QUFBeUI7QUFBRSxTQUFDLE9BQU8sT0FBUCxHQUFpQixHQUFqQixDQUFzQixPQUFPLE1BQVA7QUFBZ0I7QUFBRTs7QUFFN1E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUSxHQUFSLENBQVksT0FBWjtBQUNBLElBQUksSUFBSSxJQUFJLE9BQU8sS0FBWCxDQUFpQixHQUFqQixFQUFzQixHQUF0QixFQUEyQixDQUEzQixDQUFSO0FBQ0E7QUFDQSxJQUFJLElBQUksSUFBSSxRQUFRLE1BQVosQ0FBbUIsQ0FBbkIsRUFBc0IsTUFBTSxTQUE1QixDQUFSO0FBQ0EsSUFBSSxPQUFPLEVBQUUsTUFBTSxLQUFSLEVBQWUsT0FBTyxLQUF0QixFQUE2QixJQUFJLEtBQWpDLEVBQXdDLE1BQU0sS0FBOUMsRUFBWDtBQUNBLElBQUksUUFBUSxFQUFFLE1BQU0sQ0FBUixFQUFaOztBQUVBLFNBQVMsTUFBVCxDQUFnQixTQUFoQixFQUEyQixDQUEzQixFQUE4QixJQUE5QixFQUFvQztBQUNoQztBQUNBLFFBQUksS0FBSyxDQUFDLFlBQVksTUFBTSxJQUFuQixJQUEyQixLQUFwQztBQUNBLFVBQU0sSUFBTixHQUFhLFNBQWI7QUFDQSxNQUFFLE1BQUYsQ0FBUyxFQUFUO0FBQ0E7QUFDQTtBQUNIOztBQUVEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTLElBQVQsQ0FBYyxFQUFkLEVBQWtCLEdBQWxCLEVBQXVCLENBQXZCLEVBQTBCLElBQTFCLEVBQWdDO0FBQzVCLFdBQU8sRUFBUCxFQUFXLENBQVgsRUFBYyxJQUFkO0FBQ0EsS0FBQyxHQUFHLE1BQU0sUUFBVixFQUFvQixHQUFwQixFQUF5QixDQUFDLEVBQUUsS0FBSCxDQUF6QjtBQUNBLFdBQU8scUJBQVAsQ0FBNkIsVUFBVSxFQUFWLEVBQWM7QUFDdkMsZUFBTyxLQUFLLEVBQUwsRUFBUyxHQUFULEVBQWMsQ0FBZCxFQUFpQixJQUFqQixDQUFQO0FBQ0gsS0FGRDtBQUdIOztBQUVELE9BQU8sTUFBUCxHQUFnQixZQUFZO0FBQ3hCLFFBQUksU0FBUyxTQUFTLGNBQVQsQ0FBd0IsUUFBeEIsQ0FBYjtBQUNBLFFBQUksTUFBTSxPQUFPLFVBQVAsQ0FBa0IsSUFBbEIsQ0FBVjs7QUFFQTtBQUNBO0FBQ0EsYUFBUyxnQkFBVCxDQUEwQixTQUExQixFQUFxQyxFQUFFLE9BQUYsQ0FBVSxPQUEvQyxFQUF3RCxLQUF4RDtBQUNBLGFBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsRUFBRSxPQUFGLENBQVUsS0FBN0MsRUFBb0QsS0FBcEQ7O0FBRUEsV0FBTyxxQkFBUCxDQUE2QixVQUFVLEVBQVYsRUFBYztBQUN2QyxlQUFPLEtBQUssRUFBTCxFQUFTLEdBQVQsRUFBYyxDQUFkLEVBQWlCLElBQWpCLENBQVA7QUFDSCxLQUZEO0FBR0gsQ0FaRDs7O0FDcERBOztBQUVBLE9BQU8sY0FBUCxDQUFzQixPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUN6QyxXQUFPO0FBRGtDLENBQTdDOztBQUlBLElBQUksZUFBZSxZQUFZO0FBQUUsYUFBUyxnQkFBVCxDQUEwQixNQUExQixFQUFrQyxLQUFsQyxFQUF5QztBQUFFLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEdBQWxDLEVBQXVDO0FBQUUsZ0JBQUksYUFBYSxNQUFNLENBQU4sQ0FBakIsQ0FBMkIsV0FBVyxVQUFYLEdBQXdCLFdBQVcsVUFBWCxJQUF5QixLQUFqRCxDQUF3RCxXQUFXLFlBQVgsR0FBMEIsSUFBMUIsQ0FBZ0MsSUFBSSxXQUFXLFVBQWYsRUFBMkIsV0FBVyxRQUFYLEdBQXNCLElBQXRCLENBQTRCLE9BQU8sY0FBUCxDQUFzQixNQUF0QixFQUE4QixXQUFXLEdBQXpDLEVBQThDLFVBQTlDO0FBQTREO0FBQUUsS0FBQyxPQUFPLFVBQVUsV0FBVixFQUF1QixVQUF2QixFQUFtQyxXQUFuQyxFQUFnRDtBQUFFLFlBQUksVUFBSixFQUFnQixpQkFBaUIsWUFBWSxTQUE3QixFQUF3QyxVQUF4QyxFQUFxRCxJQUFJLFdBQUosRUFBaUIsaUJBQWlCLFdBQWpCLEVBQThCLFdBQTlCLEVBQTRDLE9BQU8sV0FBUDtBQUFxQixLQUFoTjtBQUFtTixDQUE5aEIsRUFBbkI7O0FBRUEsU0FBUyxlQUFULENBQXlCLFFBQXpCLEVBQW1DLFdBQW5DLEVBQWdEO0FBQUUsUUFBSSxFQUFFLG9CQUFvQixXQUF0QixDQUFKLEVBQXdDO0FBQUUsY0FBTSxJQUFJLFNBQUosQ0FBYyxtQ0FBZCxDQUFOO0FBQTJEO0FBQUU7O0FBRXpKLFFBQVEsTUFBUixHQUFpQixNQUFqQjs7QUFFQSxJQUFJLFNBQVMsWUFBWTtBQUNyQixhQUFTLE1BQVQsQ0FBZ0IsS0FBaEIsRUFBdUIsT0FBdkIsRUFBZ0M7QUFDNUIsd0JBQWdCLElBQWhCLEVBQXNCLE1BQXRCOztBQUVBLGFBQUssS0FBTCxHQUFhLEtBQWI7QUFDQSxhQUFLLE9BQUwsR0FBZSxPQUFmO0FBQ0EsYUFBSyxLQUFMLEdBQWEsRUFBRSxNQUFNLEtBQVIsRUFBZSxPQUFPLEtBQXRCLEVBQWI7QUFDSDs7QUFFRCxpQkFBYSxNQUFiLEVBQXFCLENBQUM7QUFDbEIsYUFBSyxRQURhO0FBRWxCLGVBQU8sU0FBUyxNQUFULENBQWdCLEVBQWhCLEVBQW9CO0FBQ3ZCLGlCQUFLLEtBQUwsQ0FBVyxrQkFBWCxDQUE4QixLQUFLLEtBQW5DLEVBQTBDLEVBQTFDO0FBQ0g7QUFKaUIsS0FBRCxFQUtsQjtBQUNDLGFBQUssY0FETjtBQUVDLGVBQU8sU0FBUyxZQUFULEdBQXdCO0FBQzNCLHFCQUFTLGdCQUFULENBQTBCLFNBQTFCLEVBQXFDLEtBQUssT0FBTCxDQUFhLE9BQWxELEVBQTJELEtBQTNEO0FBQ0EscUJBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsS0FBSyxPQUFMLENBQWEsS0FBaEQsRUFBdUQsS0FBdkQ7QUFDSDtBQUxGLEtBTGtCLENBQXJCOztBQWFBLFdBQU8sTUFBUDtBQUNILENBdkJZLEVBQWIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZXhwb3J0cy5DdXJ2ZSA9IEN1cnZlO1xuXG52YXIgQ3VydmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ3VydmUoeCwgeSwgYW5nLCBjdXJ2ZSkge1xuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ3VydmUpO1xuXG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG5cbiAgICAgICAgdGhpcy5hbmcgPSBhbmc7XG4gICAgICAgIHRoaXMuYW5nU3BlZWQgPSBnYW1lRGVmaW5pdGlvbi5iYXNlVHVyblNwZWVkO1xuXG4gICAgICAgIHRoaXMuc3BlZWQgPSBnYW1lRGVmaW5pdGlvbi5iYXNlU3BlZWQ7XG5cbiAgICAgICAgdGhpcy50YWlsID0gW3sgeDogeCwgeTogeSB9XTtcblxuICAgICAgICB0aGlzLmNvbG9yID0gXCJyZWRcIjtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoQ3VydmUsIFt7XG4gICAgICAgIGtleTogXCJ1cGRhdGVcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICAgICAgdGhpcy54ICs9IE1hdGguY29zKHRoaXMuYW5nKSAqIHRoaXMuc3BlZWQgKiBkdDtcbiAgICAgICAgICAgIHRoaXMueSArPSBNYXRoLnNpbih0aGlzLmFuZykgKiB0aGlzLnNwZWVkICogZHQ7XG5cbiAgICAgICAgICAgIHZhciB0YWlsSGVhZCA9IHRoaXMudGFpbFswXTtcblxuICAgICAgICAgICAgaWYgKE1hdGguaHlwb3QodGhpcy54IC0gdGFpbEhlYWQueCwgdGhpcy55IC0gdGFpbEhlYWQueSkgPiBnYW1lRGVmaW5pdGlvbi50YWlsRGlzdGFuY2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRhaWwudW5zaGlmdCh7IHg6IHRoaXMueCwgeTogdGhpcy55IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwic2V0QW5ndWxhclZlbG9jaXR5XCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRBbmd1bGFyVmVsb2NpdHkoa2V5cywgZHQpIHtcbiAgICAgICAgICAgIGlmIChrZXlzLnJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmcgKz0gdGhpcy5hbmdTcGVlZCAqIGR0O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChrZXlzLmxlZnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuZyAtPSB0aGlzLmFuZ1NwZWVkICogZHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYW5nID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcImdldFNhZmVUYWlsXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRTYWZlVGFpbCgpIHtcbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHZhciBmaXJzdFNhZmUgPSB0aGlzLnRhaWwuZmluZEluZGV4KGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguaHlwb3QoX3RoaXMueCAtIHQueCwgX3RoaXMueSAtIHQueSkgPiBnYW1lRGVmaW5pdGlvbi50YWlsRGlzdGFuY2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgZmlyc3RTYWZlID09PSBcIm51bWJlclwiID8gdGhpcy50YWlsLnNsaWNlKGZpcnN0U2FmZSkgOiBbXTtcbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcImNvbGxpZGVcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNvbGxpZGUob3RoZXJUYWlsKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgICAgICAgcmV0dXJuIG90aGVyVGFpbC5zb21lKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguaHlwb3QoX3RoaXMyLnggLSB0LngsIF90aGlzMi55IC0gdC55KSA8IGdhbWVEZWZpbml0aW9uLnRhaWxEaXN0YW5jZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIEN1cnZlO1xufSgpOyIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRyYXdHYW1lID0gdW5kZWZpbmVkO1xuXG52YXIgX2dhbWVEZWZpbml0aW9uID0gcmVxdWlyZShcIi4vZ2FtZURlZmluaXRpb24uanNcIik7XG5cbmV4cG9ydHMuZHJhd0dhbWUgPSBkcmF3R2FtZTtcblxuXG5mdW5jdGlvbiBkcmF3Q2lyY2xlKGN0eCwgX3JlZiwgcikge1xuICAgIHZhciB4ID0gX3JlZi54LFxuICAgICAgICB5ID0gX3JlZi55O1xuXG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmFyYyh4LCB5LCByLCAwLCBNYXRoLlBJICogMik7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbn1cblxuZnVuY3Rpb24gZHJhd0N1cnZlKGN0eCwgY3VydmUpIHtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN1cnZlLnRhaWwuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICByZXR1cm4gZHJhd0NpcmNsZShjdHgsIHQsIF9nYW1lRGVmaW5pdGlvbi5nYW1lRGVmaW5pdGlvbi5iYXNlUmFkaXVzKTtcbiAgICB9KTtcbiAgICBkcmF3Q2lyY2xlKGN0eCwgeyB4OiBjdXJ2ZS54LCB5OiBjdXJ2ZS55IH0sIF9nYW1lRGVmaW5pdGlvbi5nYW1lRGVmaW5pdGlvbi5iYXNlUmFkaXVzKTtcbiAgICBjdHgucmVzdG9yZSgpO1xufVxuXG5mdW5jdGlvbiBkcmF3R2FtZShjdHgsIGN1cnZlcykge1xuICAgIC8vIFRPRE86IGdhbWUgc2l6ZSBzaG91bGQgYmUgc2V0IHNvbWV3aGVyZSBlbHNlXG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCA1MDAsIDUwMCk7XG4gICAgY3VydmVzLmZvckVhY2goZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgcmV0dXJuIGRyYXdDdXJ2ZShjdHgsIGMpO1xuICAgIH0pO1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5nYW1lRGVmaW5pdGlvbiA9IGdhbWVEZWZpbml0aW9uO1xuXG5cbnZhciBnYW1lRGVmaW5pdGlvbiA9IHsgYmFzZVNwZWVkOiAxMDAsXG4gIGJhc2VSYWRpdXM6IDUsXG4gIGJhc2VUdXJuU3BlZWQ6IE1hdGguUEksXG4gIHRhaWxEaXN0YW5jZTogM1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5leHBvcnRzLktleU1hcHBpbmcgPSBLZXlNYXBwaW5nO1xuZXhwb3J0cy5hZE1hcHBpbmcgPSBhZE1hcHBpbmc7XG5leHBvcnRzLmZnTWFwcGluZyA9IGZnTWFwcGluZztcbmV4cG9ydHMuYXJyb3dzTWFwcGluZyA9IGFycm93c01hcHBpbmc7XG5cbnZhciBLZXlNYXBwaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEtleU1hcHBpbmcobGVmdCwgcmlnaHQpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEtleU1hcHBpbmcpO1xuXG4gICAgICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMucmlnaHQgPSByaWdodDtcbiAgICB9XG5cbiAgICBfY3JlYXRlQ2xhc3MoS2V5TWFwcGluZywgW3tcbiAgICAgICAga2V5OiBcImtleURvd25cIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGtleURvd24oZSkge1xuICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gdGhpcy5sZWZ0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sZWZ0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZS5rZXlDb2RlID09PSB0aGlzLnJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yaWdodCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJrZXlVcFwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24ga2V5VXAoZSkge1xuICAgICAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gdGhpcy5sZWZ0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sZWZ0ID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0gdGhpcy5yaWdodCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmlnaHQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBLZXlNYXBwaW5nO1xufSgpO1xuXG47XG5cbnZhciBhZE1hcHBpbmcgPSBuZXcgS2V5TWFwcGluZygpO1xuXG52YXIgZmdNYXBwaW5nID0gbmV3IEtleU1hcHBpbmcoKTtcblxudmFyIGFycm93c01hcHBpbmcgPSBuZXcgS2V5TWFwcGluZygzNywgMzkpOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX2N1cnZlID0gcmVxdWlyZShcIi4vY3VydmVcIik7XG5cbnZhciBfcGxheWVyID0gcmVxdWlyZShcIi4vcGxheWVyXCIpO1xuXG52YXIgX2lucHV0ID0gcmVxdWlyZShcIi4vaW5wdXRcIik7XG5cbnZhciBJbnB1dCA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9pbnB1dCk7XG5cbnZhciBfZHJhdyA9IHJlcXVpcmUoXCIuL2RyYXdcIik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKG9iaikgeyBpZiAob2JqICYmIG9iai5fX2VzTW9kdWxlKSB7IHJldHVybiBvYmo7IH0gZWxzZSB7IHZhciBuZXdPYmogPSB7fTsgaWYgKG9iaiAhPSBudWxsKSB7IGZvciAodmFyIGtleSBpbiBvYmopIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIG5ld09ialtrZXldID0gb2JqW2tleV07IH0gfSBuZXdPYmouZGVmYXVsdCA9IG9iajsgcmV0dXJuIG5ld09iajsgfSB9XG5cbi8vIGNvbnN0IHAgPSBuZXcgUGxheWVyKDIwMCwgMjAwLCAwKTtcbi8qIGpzaGludCBlc3ZlcnNpb246IDYgKi9cblxuLy8gaW1wb3J0ICogYXMgUGxheWVyIGZyb20gXCIuL3BsYXllci5qc1wiO1xuLy8gaW1wb3J0ICogYXMgQ3VydmUgZnJvbSBcIi4vY3VydmUuanNcIjtcbmNvbnNvbGUubG9nKF9wbGF5ZXIpO1xudmFyIGMgPSBuZXcgX2N1cnZlLkN1cnZlKDIwMCwgMjAwLCAwKTtcbi8vIGNvbnN0IG0gPSBuZXcgSW5wdXQuS2V5TWFwcGluZygpXG52YXIgcCA9IG5ldyBfcGxheWVyLlBsYXllcihjLCBJbnB1dC5hZE1hcHBpbmcpO1xudmFyIGtleXMgPSB7IGxlZnQ6IGZhbHNlLCByaWdodDogZmFsc2UsIHVwOiBmYWxzZSwgZG93bjogZmFsc2UgfTtcbnZhciBzdGF0ZSA9IHsgdGltZTogMCB9O1xuXG5mdW5jdGlvbiB1cGRhdGUoZnJhbWVUaW1lLCBwLCBrZXlzKSB7XG4gICAgLy8gY29udmVydCBkdCB0byBzZWNvbmRzXG4gICAgdmFyIGR0ID0gKGZyYW1lVGltZSAtIHN0YXRlLnRpbWUpICogMC4wMDE7XG4gICAgc3RhdGUudGltZSA9IGZyYW1lVGltZTtcbiAgICBwLnVwZGF0ZShkdCk7XG4gICAgLy8gYy5zZXRBbmd1bGFyVmVsb2NpdHkoa2V5cywgZHQpO1xuICAgIC8vIHAudXBkYXRlKGR0KTtcbn1cblxuLy8gZnVuY3Rpb24gZHJhdyhjdHgsIHMpIHtcbi8vIFRPRE8gZml4IG1hZ2ljIG51bWJlcnNcbi8vIGN0eC5jbGVhclJlY3QoMCwgMCwgNTAwLCA1MDApO1xuLy8gcC5kcmF3KGN0eCk7XG5cbi8vIGRyYXdHYW1lKGN0eCwgW3BdKTtcbi8vIGRyYXdDaXJjbGUoY3R4LCBwLCAxMCk7XG4vLyB9XG5cbmZ1bmN0aW9uIHN0ZXAoZHQsIGN0eCwgcCwga2V5cykge1xuICAgIHVwZGF0ZShkdCwgcCwga2V5cyk7XG4gICAgKDAsIF9kcmF3LmRyYXdHYW1lKShjdHgsIFtwLmN1cnZlXSk7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoZHQpIHtcbiAgICAgICAgcmV0dXJuIHN0ZXAoZHQsIGN0eCwgcCwga2V5cyk7XG4gICAgfSk7XG59XG5cbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpO1xuICAgIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gICAgLy8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwga2V5RG93bkhhbmRsZXIsIGZhbHNlKTtcbiAgICAvLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwga2V5VXBIYW5kbGVyLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgcC5tYXBwaW5nLmtleURvd24sIGZhbHNlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgcC5tYXBwaW5nLmtleVVwLCBmYWxzZSk7XG5cbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uIChkdCkge1xuICAgICAgICByZXR1cm4gc3RlcChkdCwgY3R4LCBwLCBrZXlzKTtcbiAgICB9KTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5leHBvcnRzLlBsYXllciA9IFBsYXllcjtcblxudmFyIFBsYXllciA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQbGF5ZXIoY3VydmUsIG1hcHBpbmcpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFBsYXllcik7XG5cbiAgICAgICAgdGhpcy5jdXJ2ZSA9IGN1cnZlO1xuICAgICAgICB0aGlzLm1hcHBpbmcgPSBtYXBwaW5nO1xuICAgICAgICB0aGlzLmlucHV0ID0geyBsZWZ0OiBmYWxzZSwgcmlnaHQ6IGZhbHNlIH07XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKFBsYXllciwgW3tcbiAgICAgICAga2V5OiBcInVwZGF0ZVwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgICAgICB0aGlzLmN1cnZlLnNldEFuZ3VsYXJWZWxvY2l0eSh0aGlzLmlucHV0LCBkdCk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJhZGRMaXN0ZW5lcnNcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGFkZExpc3RlbmVycygpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMubWFwcGluZy5rZXlEb3duLCBmYWxzZSk7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy5tYXBwaW5nLmtleVVwLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gUGxheWVyO1xufSgpOyJdfQ==
