(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

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

////// CURVE

var Curve = function () {
    function Curve(x, y, ang, color) {
        _classCallCheck(this, Curve);

        this.x = x;
        this.y = y;

        this.ang = ang;
        this.angSpeed = gameDefinition.baseTurnSpeed;

        this.speed = gameDefinition.baseSpeed;

        this.tail = [{ x: x, y: y }];

        this.color = color;

        this.alive = true;
    }

    _createClass(Curve, [{
        key: "update",
        value: function update(dt) {
            if (this.alive) {
                this.x += Math.cos(this.ang) * this.speed * dt;
                this.y += Math.sin(this.ang) * this.speed * dt;

                var tailHead = this.tail[0];

                if (Math.hypot(this.x - tailHead.x, this.y - tailHead.y) > gameDefinition.tailDistance) {
                    this.tail.unshift({ x: this.x, y: this.y });
                }
            }
        }
    }, {
        key: "setAngularVelocity",
        value: function setAngularVelocity(keys, dt) {
            if (keys.right) {
                this.ang += this.angSpeed * dt;
            } else if (keys.left) {
                this.ang -= this.angSpeed * dt;
            }
        }
    }, {
        key: "getSafeTail",
        value: function getSafeTail() {
            var _this = this;

            var firstSafe = this.tail.findIndex(function (t) {
                return Math.hypot(_this.x - t.x, _this.y - t.y) > gameDefinition.baseRadius * 2;
            });
            return firstSafe !== -1 ? this.tail.slice(firstSafe) : [];
        }
    }, {
        key: "collide",
        value: function collide(otherTail) {
            var _this2 = this;

            return otherTail.some(function (t) {
                return Math.hypot(_this2.x - t.x, _this2.y - t.y) < gameDefinition.baseRadius * 1.95;
            });
        }
    }]);

    return Curve;
}();

function collideCurves(curves) {
    curves.forEach(function (curve1) {
        curves.forEach(function (curve2) {
            if (curve1 !== curve2) {
                if (curve1.collide(curve2.tail)) {
                    curve1.alive = false;
                }
            } else {
                if (curve1.collide(curve2.getSafeTail())) {
                    curve1.alive = false;
                }
            }
        });
    });
}

/////// PLAYER


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
            this.curve.update(dt);
        }
    }, {
        key: "addListeners",
        value: function addListeners() {
            var _this3 = this;

            document.addEventListener("keydown", function (e) {
                return _this3.mapping.keyDown(e, _this3.input);
            }, false);
            document.addEventListener("keyup", function (e) {
                return _this3.mapping.keyUp(e, _this3.input);
            }, false);
        }
    }]);

    return Player;
}();

/////// INPUT

var KeyMapping = function () {
    function KeyMapping(leftKey, rightKey) {
        _classCallCheck(this, KeyMapping);

        this.leftKey = leftKey;
        this.rightKey = rightKey;
    }

    _createClass(KeyMapping, [{
        key: "keyDown",
        value: function keyDown(e, state) {
            if (e.keyCode === this.leftKey) {
                state.left = true;
            } else if (e.keyCode === this.rightKey) {
                state.right = true;
            }
        }
    }, {
        key: "keyUp",
        value: function keyUp(e, state) {
            if (e.keyCode === this.leftKey) {
                state.left = false;
            } else if (e.keyCode === this.rightKey) {
                state.right = false;
            }
        }
    }]);

    return KeyMapping;
}();

;

var asMapping = new KeyMapping(65, 79);

var uiMapping = new KeyMapping(85, 73);

var arrowsMapping = new KeyMapping(37, 39);

/////// DRAW

function drawCircle(ctx, _ref, r, color) {
    var x = _ref.x,
        y = _ref.y;

    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawCurve(ctx, curve) {
    ctx.save();
    curve.tail.forEach(function (t) {
        return drawCircle(ctx, t, gameDefinition.baseRadius, curve.color);
    });
    drawCircle(ctx, { x: curve.x, y: curve.y }, gameDefinition.baseRadius, curve.color);
    ctx.restore();
}

function drawGame(ctx, curves) {
    // TODO: game size should be set somewhere else
    ctx.clearRect(0, 0, 700, 700);
    curves.forEach(function (c) {
        return drawCurve(ctx, c);
    });
}

//////// GAME DEFINITION

var gameDefinition = { baseSpeed: 100,
    baseRadius: 5,
    baseTurnSpeed: Math.PI,
    tailDistance: 3
};

//////// MAIN

var c = new Curve(200, 200, 0, "red");
var p = new Player(c, arrowsMapping);

// const ps = [p];

var ps = [new Player(new Curve(200, 200, 0, "red"), arrowsMapping), new Player(new Curve(400, 400, Math.PI, "blue"), asMapping)];

var state = { time: 0 };

function update(frameTime, ps) {
    var dt = (frameTime - state.time) * 0.001;
    state.time = frameTime;
    ps.forEach(function (p) {
        return p.update(dt);
    });
}

function step(frameTime, ctx, ps) {
    update(frameTime, ps);
    var curves = ps.map(function (p) {
        return p.curve;
    });
    collideCurves(curves);
    drawGame(ctx, curves);
    window.requestAnimationFrame(function (frameTime) {
        return step(frameTime, ctx, ps);
    });
}

window.onload = function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    ps.forEach(function (p) {
        return p.addListeners();
    });

    window.requestAnimationFrame(function (frameTime) {
        return step(frameTime, ctx, ps);
    });
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvYmFkbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0NBOztJLEFBRU0sb0JBQ0Y7bUJBQUEsQUFBWSxHQUFaLEFBQWUsR0FBZixBQUFrQixLQUFsQixBQUF1QixPQUFPOzhCQUMxQjs7YUFBQSxBQUFLLElBQUwsQUFBUyxBQUNUO2FBQUEsQUFBSyxJQUFMLEFBQVMsQUFFVDs7YUFBQSxBQUFLLE1BQUwsQUFBVyxBQUNYO2FBQUEsQUFBSyxXQUFXLGVBQWhCLEFBQStCLEFBRS9COzthQUFBLEFBQUssUUFBUSxlQUFiLEFBQTRCLEFBRTVCOzthQUFBLEFBQUssT0FBTyxDQUFDLEVBQUMsR0FBRCxHQUFJLEdBQWpCLEFBQVksQUFBQyxBQUViOzthQUFBLEFBQUssUUFBTCxBQUFhLEFBRWI7O2FBQUEsQUFBSyxRQUFMLEFBQWEsQUFFaEI7Ozs7OytCLEFBRU0sSUFBSSxBQUNQO2dCQUFJLEtBQUosQUFBUyxPQUFPLEFBQ1o7cUJBQUEsQUFBSyxLQUFLLEtBQUEsQUFBSyxJQUFJLEtBQVQsQUFBYyxPQUFPLEtBQXJCLEFBQTBCLFFBQXBDLEFBQTRDLEFBQzVDO3FCQUFBLEFBQUssS0FBSyxLQUFBLEFBQUssSUFBSSxLQUFULEFBQWMsT0FBTyxLQUFyQixBQUEwQixRQUFwQyxBQUE0QyxBQUU1Qzs7b0JBQUksV0FBVyxLQUFBLEFBQUssS0FBcEIsQUFBZSxBQUFVLEFBRXpCOztvQkFBSSxLQUFBLEFBQUssTUFBTSxLQUFBLEFBQUssSUFBSSxTQUFwQixBQUE2QixHQUFHLEtBQUEsQUFBSyxJQUFJLFNBQXpDLEFBQWtELEtBQUssZUFBM0QsQUFBMEUsY0FBYyxBQUNwRjt5QkFBQSxBQUFLLEtBQUwsQUFBVSxRQUFRLEVBQUMsR0FBRSxLQUFILEFBQVEsR0FBRyxHQUFFLEtBQS9CLEFBQWtCLEFBQWtCLEFBQ3ZDO0FBQ0o7QUFDSjs7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U0FBQSxBQUFTLEtBQVQsQUFBYyxXQUFkLEFBQXlCLEtBQXpCLEFBQThCLElBQUksQUFDOUI7V0FBQSxBQUFPLFdBQVAsQUFBa0IsQUFDbEI7UUFBTSxZQUFTLEFBQUcsSUFBSSxhQUFBO2VBQUssRUFBTCxBQUFPO0FBQTdCLEFBQWUsQUFDZixLQURlO2tCQUNmLEFBQWMsQUFDZDthQUFBLEFBQVMsS0FBVCxBQUFjLEFBQ2Q7V0FBQSxBQUFPLHNCQUFzQixxQkFBQTtlQUFhLEtBQUEsQUFBSyxXQUFMLEFBQWdCLEtBQTdCLEFBQWEsQUFBcUI7QUFBL0QsQUFDSDs7O0FBRUQsT0FBQSxBQUFPLFNBQVMsWUFBTSxBQUNsQjtRQUFNLFNBQVMsU0FBQSxBQUFTLGVBQXhCLEFBQWUsQUFBd0IsQUFDdkM7UUFBTSxNQUFNLE9BQUEsQUFBTyxXQUFuQixBQUFZLEFBQWtCLEFBRTlCOztPQUFBLEFBQUcsUUFBUSxhQUFBO2VBQUssRUFBTCxBQUFLLEFBQUU7QUFBbEIsQUFFQTs7V0FBQSxBQUFPLHNCQUFzQixxQkFBQTtlQUFhLEtBQUEsQUFBSyxXQUFMLEFBQWdCLEtBQTdCLEFBQWEsQUFBcUI7QUFBL0QsQUFDSDtBQVBEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLy8vLy8vIENVUlZFXG5cbmNsYXNzIEN1cnZlIHtcbiAgICBjb25zdHJ1Y3Rvcih4LCB5LCBhbmcsIGNvbG9yKSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG5cbiAgICAgICAgdGhpcy5hbmcgPSBhbmc7XG4gICAgICAgIHRoaXMuYW5nU3BlZWQgPSBnYW1lRGVmaW5pdGlvbi5iYXNlVHVyblNwZWVkO1xuXG4gICAgICAgIHRoaXMuc3BlZWQgPSBnYW1lRGVmaW5pdGlvbi5iYXNlU3BlZWQ7XG5cbiAgICAgICAgdGhpcy50YWlsID0gW3t4LCB5fV07XG5cbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuXG4gICAgICAgIHRoaXMuYWxpdmUgPSB0cnVlO1xuXG4gICAgfVxuXG4gICAgdXBkYXRlKGR0KSB7XG4gICAgICAgIGlmICh0aGlzLmFsaXZlKSB7XG4gICAgICAgICAgICB0aGlzLnggKz0gTWF0aC5jb3ModGhpcy5hbmcpICogdGhpcy5zcGVlZCAqIGR0O1xuICAgICAgICAgICAgdGhpcy55ICs9IE1hdGguc2luKHRoaXMuYW5nKSAqIHRoaXMuc3BlZWQgKiBkdDtcblxuICAgICAgICAgICAgbGV0IHRhaWxIZWFkID0gdGhpcy50YWlsWzBdO1xuXG4gICAgICAgICAgICBpZiAoTWF0aC5oeXBvdCh0aGlzLnggLSB0YWlsSGVhZC54LCB0aGlzLnkgLSB0YWlsSGVhZC55KSA+IGdhbWVEZWZpbml0aW9uLnRhaWxEaXN0YW5jZSkge1xuICAgICAgICAgICAgICAgIHRoaXMudGFpbC51bnNoaWZ0KHt4OnRoaXMueCwgeTp0aGlzLnl9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldEFuZ3VsYXJWZWxvY2l0eShrZXlzLCBkdCkge1xuICAgICAgICBpZiAoa2V5cy5yaWdodCkge1xuICAgICAgICAgICAgdGhpcy5hbmcgKz0gdGhpcy5hbmdTcGVlZCAqIGR0O1xuICAgICAgICB9IGVsc2UgaWYgKGtleXMubGVmdCkge1xuICAgICAgICAgICAgdGhpcy5hbmcgLT0gdGhpcy5hbmdTcGVlZCAqIGR0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0U2FmZVRhaWwoKSB7XG4gICAgICAgIGxldCBmaXJzdFNhZmUgPVxuICAgICAgICAgICAgICAgIHRoaXMudGFpbC5maW5kSW5kZXgodCA9PiBNYXRoLmh5cG90KHRoaXMueCAtIHQueCwgdGhpcy55IC0gdC55KSA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lRGVmaW5pdGlvbi5iYXNlUmFkaXVzICogMik7XG4gICAgICAgIHJldHVybiBmaXJzdFNhZmUgIT09IC0xID8gdGhpcy50YWlsLnNsaWNlKGZpcnN0U2FmZSkgOiBbXTtcbiAgICB9XG5cbiAgICBjb2xsaWRlKG90aGVyVGFpbCkge1xuICAgICAgICByZXR1cm4gb3RoZXJUYWlsLnNvbWUodCA9PiBNYXRoLmh5cG90KHRoaXMueCAtIHQueCwgdGhpcy55IC0gdC55KSA8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYW1lRGVmaW5pdGlvbi5iYXNlUmFkaXVzICogMS45NSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjb2xsaWRlQ3VydmVzKGN1cnZlcykge1xuICAgIGN1cnZlcy5mb3JFYWNoKGN1cnZlMSA9PiB7XG4gICAgICAgIGN1cnZlcy5mb3JFYWNoKGN1cnZlMiA9PiB7XG4gICAgICAgICAgICBpZiAoY3VydmUxICE9PSBjdXJ2ZTIpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VydmUxLmNvbGxpZGUoY3VydmUyLnRhaWwpKSB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnZlMS5hbGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnZlMS5jb2xsaWRlKGN1cnZlMi5nZXRTYWZlVGFpbCgpKSkge1xuICAgICAgICAgICAgICAgICAgICBjdXJ2ZTEuYWxpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG4vLy8vLy8vIFBMQVlFUlxuXG5cbmNsYXNzIFBsYXllciB7XG4gICAgY29uc3RydWN0b3IoY3VydmUsIG1hcHBpbmcpIHtcbiAgICAgICAgdGhpcy5jdXJ2ZSA9IGN1cnZlO1xuICAgICAgICB0aGlzLm1hcHBpbmcgPSBtYXBwaW5nO1xuICAgICAgICB0aGlzLmlucHV0ID0geyBsZWZ0OiBmYWxzZSwgcmlnaHQ6IGZhbHNlIH07XG4gICAgfVxuXG4gICAgdXBkYXRlKGR0KSB7XG4gICAgICAgIHRoaXMuY3VydmUuc2V0QW5ndWxhclZlbG9jaXR5KHRoaXMuaW5wdXQsIGR0KTtcbiAgICAgICAgdGhpcy5jdXJ2ZS51cGRhdGUoZHQpO1xuICAgIH1cblxuICAgIGFkZExpc3RlbmVycygpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZSA9PiB0aGlzLm1hcHBpbmcua2V5RG93bihlLCB0aGlzLmlucHV0KSwgZmFsc2UpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZSA9PiB0aGlzLm1hcHBpbmcua2V5VXAoZSwgdGhpcy5pbnB1dCksIGZhbHNlKTtcbiAgICB9XG59XG5cbi8vLy8vLy8gSU5QVVRcblxuY2xhc3MgS2V5TWFwcGluZyB7XG4gICAgY29uc3RydWN0b3IobGVmdEtleSwgcmlnaHRLZXkpIHtcbiAgICAgICAgdGhpcy5sZWZ0S2V5ID0gbGVmdEtleTtcbiAgICAgICAgdGhpcy5yaWdodEtleSA9IHJpZ2h0S2V5O1xuICAgIH1cblxuICAgIGtleURvd24oZSwgc3RhdGUpIHtcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gdGhpcy5sZWZ0S2V5KSB7XG4gICAgICAgICAgICBzdGF0ZS5sZWZ0ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChlLmtleUNvZGUgPT09IHRoaXMucmlnaHRLZXkpIHtcbiAgICAgICAgICAgIHN0YXRlLnJpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGtleVVwKGUsIHN0YXRlKSB7XG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IHRoaXMubGVmdEtleSkge1xuICAgICAgICAgICAgc3RhdGUubGVmdCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0gdGhpcy5yaWdodEtleSkge1xuICAgICAgICAgICAgc3RhdGUucmlnaHQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmNvbnN0IGFzTWFwcGluZyA9IG5ldyBLZXlNYXBwaW5nKDY1LCA3OSk7XG5cbmNvbnN0IHVpTWFwcGluZyA9IG5ldyBLZXlNYXBwaW5nKDg1LCA3Myk7XG5cbmNvbnN0IGFycm93c01hcHBpbmcgPSBuZXcgS2V5TWFwcGluZygzNywgMzkpO1xuXG5cbi8vLy8vLy8gRFJBV1xuXG5mdW5jdGlvbiBkcmF3Q2lyY2xlKGN0eCwge3gsIHl9LCByLCBjb2xvcikge1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHguYXJjKHgsIHksIHIsIDAsIE1hdGguUEkqMik7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgY3R4LnJlc3RvcmUoKTtcbn1cblxuZnVuY3Rpb24gZHJhd0N1cnZlKGN0eCwgY3VydmUpIHtcbiAgICBjdHguc2F2ZSgpO1xuICAgIGN1cnZlLnRhaWwuZm9yRWFjaCh0ID0+IGRyYXdDaXJjbGUoY3R4LCB0LCBnYW1lRGVmaW5pdGlvbi5iYXNlUmFkaXVzLCBjdXJ2ZS5jb2xvcikpO1xuICAgIGRyYXdDaXJjbGUoY3R4LCB7eDpjdXJ2ZS54LCB5OmN1cnZlLnl9LCBnYW1lRGVmaW5pdGlvbi5iYXNlUmFkaXVzLCBjdXJ2ZS5jb2xvcik7XG4gICAgY3R4LnJlc3RvcmUoKTtcbn1cblxuZnVuY3Rpb24gZHJhd0dhbWUoY3R4LCBjdXJ2ZXMpIHtcbiAgICAvLyBUT0RPOiBnYW1lIHNpemUgc2hvdWxkIGJlIHNldCBzb21ld2hlcmUgZWxzZVxuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgNzAwLCA3MDApO1xuICAgIGN1cnZlcy5mb3JFYWNoKGMgPT4gZHJhd0N1cnZlKGN0eCwgYykpO1xufVxuXG5cbi8vLy8vLy8vIEdBTUUgREVGSU5JVElPTlxuXG5jb25zdCBnYW1lRGVmaW5pdGlvbiA9XG4gICAgICB7IGJhc2VTcGVlZCA6IDEwMCxcbiAgICAgICAgYmFzZVJhZGl1czogNSxcbiAgICAgICAgYmFzZVR1cm5TcGVlZDogTWF0aC5QSSxcbiAgICAgICAgdGFpbERpc3RhbmNlIDogM1xuICAgICAgfTtcblxuXG5cbi8vLy8vLy8vIE1BSU5cblxuY29uc3QgYyA9IG5ldyBDdXJ2ZSgyMDAsIDIwMCwgMCwgXCJyZWRcIik7XG5jb25zdCBwID0gbmV3IFBsYXllcihjLCBhcnJvd3NNYXBwaW5nKTtcblxuLy8gY29uc3QgcHMgPSBbcF07XG5cbmNvbnN0IHBzID0gW25ldyBQbGF5ZXIobmV3IEN1cnZlKDIwMCwgMjAwLCAwLCBcInJlZFwiKSwgYXJyb3dzTWFwcGluZyksXG4gICAgICAgICAgICBuZXcgUGxheWVyKG5ldyBDdXJ2ZSg0MDAsIDQwMCwgTWF0aC5QSSwgXCJibHVlXCIpLCBhc01hcHBpbmcpXTtcblxuY29uc3Qgc3RhdGUgPSB7dGltZSA6IDB9O1xuXG5mdW5jdGlvbiB1cGRhdGUoZnJhbWVUaW1lLCBwcykge1xuICAgIGxldCBkdCA9IChmcmFtZVRpbWUgLSBzdGF0ZS50aW1lKSAqIDAuMDAxO1xuICAgIHN0YXRlLnRpbWUgPSBmcmFtZVRpbWU7XG4gICAgcHMuZm9yRWFjaChwID0+IHAudXBkYXRlKGR0KSk7XG59XG5cblxuZnVuY3Rpb24gc3RlcChmcmFtZVRpbWUsIGN0eCwgcHMpIHtcbiAgICB1cGRhdGUoZnJhbWVUaW1lLCBwcyk7XG4gICAgY29uc3QgY3VydmVzID0gcHMubWFwKHAgPT4gcC5jdXJ2ZSk7XG4gICAgY29sbGlkZUN1cnZlcyhjdXJ2ZXMpO1xuICAgIGRyYXdHYW1lKGN0eCwgY3VydmVzKTtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZyYW1lVGltZSA9PiBzdGVwKGZyYW1lVGltZSwgY3R4LCBwcykpO1xufVxuXG53aW5kb3cub25sb2FkID0gKCkgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpO1xuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgICBwcy5mb3JFYWNoKHAgPT4gcC5hZGRMaXN0ZW5lcnMoKSk7XG5cbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZyYW1lVGltZSA9PiBzdGVwKGZyYW1lVGltZSwgY3R4LCBwcykpO1xufTtcbiJdfQ==
