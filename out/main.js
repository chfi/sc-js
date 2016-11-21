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

var _curve = require("./curve.js");

var _player = require("./player.js");

var _input = require("./input.js");

var Input = _interopRequireWildcard(_input);

var _draw = require("./draw.js");

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
console.log(_player.Player);
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

},{"./curve.js":1,"./draw.js":2,"./input.js":4,"./player.js":6}],6:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY3VydmUuanMiLCJzcmMvZHJhdy5qcyIsInNyYy9nYW1lRGVmaW5pdGlvbi5qcyIsInNyYy9pbnB1dC5qcyIsInNyYy9tYWluLmpzIiwic3JjL3BsYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQUVBLE9BQU8sY0FBUCxDQUFzQixPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUN6QyxXQUFPO0FBRGtDLENBQTdDOztBQUlBLElBQUksZUFBZSxZQUFZO0FBQUUsYUFBUyxnQkFBVCxDQUEwQixNQUExQixFQUFrQyxLQUFsQyxFQUF5QztBQUFFLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEdBQWxDLEVBQXVDO0FBQUUsZ0JBQUksYUFBYSxNQUFNLENBQU4sQ0FBakIsQ0FBMkIsV0FBVyxVQUFYLEdBQXdCLFdBQVcsVUFBWCxJQUF5QixLQUFqRCxDQUF3RCxXQUFXLFlBQVgsR0FBMEIsSUFBMUIsQ0FBZ0MsSUFBSSxXQUFXLFVBQWYsRUFBMkIsV0FBVyxRQUFYLEdBQXNCLElBQXRCLENBQTRCLE9BQU8sY0FBUCxDQUFzQixNQUF0QixFQUE4QixXQUFXLEdBQXpDLEVBQThDLFVBQTlDO0FBQTREO0FBQUUsS0FBQyxPQUFPLFVBQVUsV0FBVixFQUF1QixVQUF2QixFQUFtQyxXQUFuQyxFQUFnRDtBQUFFLFlBQUksVUFBSixFQUFnQixpQkFBaUIsWUFBWSxTQUE3QixFQUF3QyxVQUF4QyxFQUFxRCxJQUFJLFdBQUosRUFBaUIsaUJBQWlCLFdBQWpCLEVBQThCLFdBQTlCLEVBQTRDLE9BQU8sV0FBUDtBQUFxQixLQUFoTjtBQUFtTixDQUE5aEIsRUFBbkI7O0FBRUEsU0FBUyxlQUFULENBQXlCLFFBQXpCLEVBQW1DLFdBQW5DLEVBQWdEO0FBQUUsUUFBSSxFQUFFLG9CQUFvQixXQUF0QixDQUFKLEVBQXdDO0FB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QWhCLEVBQXVCLE9BQXZCLEVBQWdDO0FBQzVCLHdCQUFnQixJQUFoQixFQUFzQixNQUF0Qjs7QUFFQSxhQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsYUFBSyxPQUFMLEdBQWUsT0FBZjtBQUNBLGFBQUssS0FBTCxHQUFhLEVBQUUsTUFBTSxLQUFSLEVBQWUsT0FBTyxLQUF0QixFQUFiO0FBQ0g7O0FBRUQsaUJBQWEsTUFBYixFQUFxQixDQUFDO0FBQ2xCLGFBQUssUUFEYTtBQUVsQixlQUFPLFNBQVMsTUFBVCxDQUFnQixFQUFoQixFQUFvQjtBQUN2QixpQkFBSyxLQUFMLENBQVcsa0JBQVgsQ0FBOEIsS0FBSyxLQUFuQyxFQUEwQyxFQUExQztBQUNIO0FBSmlCLEtBQUQsRUFLbEI7QUFDQyxhQUFLLGNBRE47QUFFQyxlQUFPLFNBQVMsWUFBVCxHQUF3QjtBQUMzQixxQkFBUyxnQkFBVCxDQUEwQixTQUExQixFQUFxQyxLQUFLLE9BQUwsQ0FBYSxPQUFsRCxFQUEyRCxLQUEzRDtBQUNBLHFCQUFTLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DLEtBQUssT0FBTCxDQUFhLEtBQWhELEVBQXVELEtBQXZEO0FBQ0g7QUFMRixLQUxrQixDQUFyQjs7QUFhQSxXQUFPLE1BQVA7QUFDSCxDQXZCWSxFQUFiIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmV4cG9ydHMuQ3VydmUgPSBDdXJ2ZTtcblxudmFyIEN1cnZlID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEN1cnZlKHgsIHksIGFuZywgY3VydmUpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEN1cnZlKTtcblxuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuXG4gICAgICAgIHRoaXMuYW5nID0gYW5nO1xuICAgICAgICB0aGlzLmFuZ1NwZWVkID0gZ2FtZURlZmluaXRpb24uYmFzZVR1cm5TcGVlZDtcblxuICAgICAgICB0aGlzLnNwZWVkID0gZ2FtZURlZmluaXRpb24uYmFzZVNwZWVkO1xuXG4gICAgICAgIHRoaXMudGFpbCA9IFt7IHg6IHgsIHk6IHkgfV07XG5cbiAgICAgICAgdGhpcy5jb2xvciA9IFwicmVkXCI7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKEN1cnZlLCBbe1xuICAgICAgICBrZXk6IFwidXBkYXRlXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgICAgIHRoaXMueCArPSBNYXRoLmNvcyh0aGlzLmFuZykgKiB0aGlzLnNwZWVkICogZHQ7XG4gICAgICAgICAgICB0aGlzLnkgKz0gTWF0aC5zaW4odGhpcy5hbmcpICogdGhpcy5zcGVlZCAqIGR0O1xuXG4gICAgICAgICAgICB2YXIgdGFpbEhlYWQgPSB0aGlzLnRhaWxbMF07XG5cbiAgICAgICAgICAgIGlmIChNYXRoLmh5cG90KHRoaXMueCAtIHRhaWxIZWFkLngsIHRoaXMueSAtIHRhaWxIZWFkLnkpID4gZ2FtZURlZmluaXRpb24udGFpbERpc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50YWlsLnVuc2hpZnQoeyB4OiB0aGlzLngsIHk6IHRoaXMueSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIHtcbiAgICAgICAga2V5OiBcInNldEFuZ3VsYXJWZWxvY2l0eVwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gc2V0QW5ndWxhclZlbG9jaXR5KGtleXMsIGR0KSB7XG4gICAgICAgICAgICBpZiAoa2V5cy5yaWdodCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYW5nICs9IHRoaXMuYW5nU3BlZWQgKiBkdDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5cy5sZWZ0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmcgLT0gdGhpcy5hbmdTcGVlZCAqIGR0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuZyA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJnZXRTYWZlVGFpbFwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gZ2V0U2FmZVRhaWwoKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICB2YXIgZmlyc3RTYWZlID0gdGhpcy50YWlsLmZpbmRJbmRleChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmh5cG90KF90aGlzLnggLSB0LngsIF90aGlzLnkgLSB0LnkpID4gZ2FtZURlZmluaXRpb24udGFpbERpc3RhbmNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGZpcnN0U2FmZSA9PT0gXCJudW1iZXJcIiA/IHRoaXMudGFpbC5zbGljZShmaXJzdFNhZmUpIDogW107XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJjb2xsaWRlXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjb2xsaWRlKG90aGVyVGFpbCkge1xuICAgICAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgICAgIHJldHVybiBvdGhlclRhaWwuc29tZShmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmh5cG90KF90aGlzMi54IC0gdC54LCBfdGhpczIueSAtIHQueSkgPCBnYW1lRGVmaW5pdGlvbi50YWlsRGlzdGFuY2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBDdXJ2ZTtcbn0oKTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kcmF3R2FtZSA9IHVuZGVmaW5lZDtcblxudmFyIF9nYW1lRGVmaW5pdGlvbiA9IHJlcXVpcmUoXCIuL2dhbWVEZWZpbml0aW9uLmpzXCIpO1xuXG5leHBvcnRzLmRyYXdHYW1lID0gZHJhd0dhbWU7XG5cblxuZnVuY3Rpb24gZHJhd0NpcmNsZShjdHgsIF9yZWYsIHIpIHtcbiAgICB2YXIgeCA9IF9yZWYueCxcbiAgICAgICAgeSA9IF9yZWYueTtcblxuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5hcmMoeCwgeSwgciwgMCwgTWF0aC5QSSAqIDIpO1xuICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICBjdHguZmlsbCgpO1xuICAgIGN0eC5yZXN0b3JlKCk7XG59XG5cbmZ1bmN0aW9uIGRyYXdDdXJ2ZShjdHgsIGN1cnZlKSB7XG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdXJ2ZS50YWlsLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgcmV0dXJuIGRyYXdDaXJjbGUoY3R4LCB0LCBfZ2FtZURlZmluaXRpb24uZ2FtZURlZmluaXRpb24uYmFzZVJhZGl1cyk7XG4gICAgfSk7XG4gICAgZHJhd0NpcmNsZShjdHgsIHsgeDogY3VydmUueCwgeTogY3VydmUueSB9LCBfZ2FtZURlZmluaXRpb24uZ2FtZURlZmluaXRpb24uYmFzZVJhZGl1cyk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbn1cblxuZnVuY3Rpb24gZHJhd0dhbWUoY3R4LCBjdXJ2ZXMpIHtcbiAgICAvLyBUT0RPOiBnYW1lIHNpemUgc2hvdWxkIGJlIHNldCBzb21ld2hlcmUgZWxzZVxuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgNTAwLCA1MDApO1xuICAgIGN1cnZlcy5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIHJldHVybiBkcmF3Q3VydmUoY3R4LCBjKTtcbiAgICB9KTtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZ2FtZURlZmluaXRpb24gPSBnYW1lRGVmaW5pdGlvbjtcblxuXG52YXIgZ2FtZURlZmluaXRpb24gPSB7IGJhc2VTcGVlZDogMTAwLFxuICBiYXNlUmFkaXVzOiA1LFxuICBiYXNlVHVyblNwZWVkOiBNYXRoLlBJLFxuICB0YWlsRGlzdGFuY2U6IDNcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZXhwb3J0cy5LZXlNYXBwaW5nID0gS2V5TWFwcGluZztcbmV4cG9ydHMuYWRNYXBwaW5nID0gYWRNYXBwaW5nO1xuZXhwb3J0cy5mZ01hcHBpbmcgPSBmZ01hcHBpbmc7XG5leHBvcnRzLmFycm93c01hcHBpbmcgPSBhcnJvd3NNYXBwaW5nO1xuXG52YXIgS2V5TWFwcGluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBLZXlNYXBwaW5nKGxlZnQsIHJpZ2h0KSB7XG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBLZXlNYXBwaW5nKTtcblxuICAgICAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLnJpZ2h0ID0gcmlnaHQ7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKEtleU1hcHBpbmcsIFt7XG4gICAgICAgIGtleTogXCJrZXlEb3duXCIsXG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBrZXlEb3duKGUpIHtcbiAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IHRoaXMubGVmdCkge1xuICAgICAgICAgICAgICAgIHRoaXMubGVmdCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0gdGhpcy5yaWdodCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmlnaHQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwge1xuICAgICAgICBrZXk6IFwia2V5VXBcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGtleVVwKGUpIHtcbiAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IHRoaXMubGVmdCkge1xuICAgICAgICAgICAgICAgIHRoaXMubGVmdCA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT09IHRoaXMucmlnaHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gS2V5TWFwcGluZztcbn0oKTtcblxuO1xuXG52YXIgYWRNYXBwaW5nID0gbmV3IEtleU1hcHBpbmcoKTtcblxudmFyIGZnTWFwcGluZyA9IG5ldyBLZXlNYXBwaW5nKCk7XG5cbnZhciBhcnJvd3NNYXBwaW5nID0gbmV3IEtleU1hcHBpbmcoMzcsIDM5KTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIF9jdXJ2ZSA9IHJlcXVpcmUoXCIuL2N1cnZlLmpzXCIpO1xuXG52YXIgX3BsYXllciA9IHJlcXVpcmUoXCIuL3BsYXllci5qc1wiKTtcblxudmFyIF9pbnB1dCA9IHJlcXVpcmUoXCIuL2lucHV0LmpzXCIpO1xuXG52YXIgSW5wdXQgPSBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChfaW5wdXQpO1xuXG52YXIgX2RyYXcgPSByZXF1aXJlKFwiLi9kcmF3LmpzXCIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXG4vLyBjb25zdCBwID0gbmV3IFBsYXllcigyMDAsIDIwMCwgMCk7XG4vKiBqc2hpbnQgZXN2ZXJzaW9uOiA2ICovXG5cbi8vIGltcG9ydCAqIGFzIFBsYXllciBmcm9tIFwiLi9wbGF5ZXIuanNcIjtcbi8vIGltcG9ydCAqIGFzIEN1cnZlIGZyb20gXCIuL2N1cnZlLmpzXCI7XG5jb25zb2xlLmxvZyhfcGxheWVyLlBsYXllcik7XG52YXIgYyA9IG5ldyBfY3VydmUuQ3VydmUoMjAwLCAyMDAsIDApO1xuLy8gY29uc3QgbSA9IG5ldyBJbnB1dC5LZXlNYXBwaW5nKClcbnZhciBwID0gbmV3IF9wbGF5ZXIuUGxheWVyKGMsIElucHV0LmFkTWFwcGluZyk7XG52YXIga2V5cyA9IHsgbGVmdDogZmFsc2UsIHJpZ2h0OiBmYWxzZSwgdXA6IGZhbHNlLCBkb3duOiBmYWxzZSB9O1xudmFyIHN0YXRlID0geyB0aW1lOiAwIH07XG5cbmZ1bmN0aW9uIHVwZGF0ZShmcmFtZVRpbWUsIHAsIGtleXMpIHtcbiAgICAvLyBjb252ZXJ0IGR0IHRvIHNlY29uZHNcbiAgICB2YXIgZHQgPSAoZnJhbWVUaW1lIC0gc3RhdGUudGltZSkgKiAwLjAwMTtcbiAgICBzdGF0ZS50aW1lID0gZnJhbWVUaW1lO1xuICAgIHAudXBkYXRlKGR0KTtcbiAgICAvLyBjLnNldEFuZ3VsYXJWZWxvY2l0eShrZXlzLCBkdCk7XG4gICAgLy8gcC51cGRhdGUoZHQpO1xufVxuXG4vLyBmdW5jdGlvbiBkcmF3KGN0eCwgcykge1xuLy8gVE9ETyBmaXggbWFnaWMgbnVtYmVyc1xuLy8gY3R4LmNsZWFyUmVjdCgwLCAwLCA1MDAsIDUwMCk7XG4vLyBwLmRyYXcoY3R4KTtcblxuLy8gZHJhd0dhbWUoY3R4LCBbcF0pO1xuLy8gZHJhd0NpcmNsZShjdHgsIHAsIDEwKTtcbi8vIH1cblxuZnVuY3Rpb24gc3RlcChkdCwgY3R4LCBwLCBrZXlzKSB7XG4gICAgdXBkYXRlKGR0LCBwLCBrZXlzKTtcbiAgICAoMCwgX2RyYXcuZHJhd0dhbWUpKGN0eCwgW3AuY3VydmVdKTtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uIChkdCkge1xuICAgICAgICByZXR1cm4gc3RlcChkdCwgY3R4LCBwLCBrZXlzKTtcbiAgICB9KTtcbn1cblxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNcIik7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgICAvLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBrZXlEb3duSGFuZGxlciwgZmFsc2UpO1xuICAgIC8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBrZXlVcEhhbmRsZXIsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBwLm1hcHBpbmcua2V5RG93biwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBwLm1hcHBpbmcua2V5VXAsIGZhbHNlKTtcblxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKGR0KSB7XG4gICAgICAgIHJldHVybiBzdGVwKGR0LCBjdHgsIHAsIGtleXMpO1xuICAgIH0pO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5leHBvcnRzLlBsYXllciA9IFBsYXllcjtcblxudmFyIFBsYXllciA9IGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQbGF5ZXIoY3VydmUsIG1hcHBpbmcpIHtcbiAgICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFBsYXllcik7XG5cbiAgICAgICAgdGhpcy5jdXJ2ZSA9IGN1cnZlO1xuICAgICAgICB0aGlzLm1hcHBpbmcgPSBtYXBwaW5nO1xuICAgICAgICB0aGlzLmlucHV0ID0geyBsZWZ0OiBmYWxzZSwgcmlnaHQ6IGZhbHNlIH07XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKFBsYXllciwgW3tcbiAgICAgICAga2V5OiBcInVwZGF0ZVwiLFxuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgICAgICB0aGlzLmN1cnZlLnNldEFuZ3VsYXJWZWxvY2l0eSh0aGlzLmlucHV0LCBkdCk7XG4gICAgICAgIH1cbiAgICB9LCB7XG4gICAgICAgIGtleTogXCJhZGRMaXN0ZW5lcnNcIixcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGFkZExpc3RlbmVycygpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIHRoaXMubWFwcGluZy5rZXlEb3duLCBmYWxzZSk7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgdGhpcy5tYXBwaW5nLmtleVVwLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gUGxheWVyO1xufSgpOyJdfQ==
