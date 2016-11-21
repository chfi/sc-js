
////// CURVE

class Curve {
    constructor(x, y, ang, color) {
        this.x = x;
        this.y = y;

        this.ang = ang;
        this.angSpeed = gameDefinition.baseTurnSpeed;

        this.speed = gameDefinition.baseSpeed;

        this.tail = [{x, y}];

        this.color = color;

        this.alive = true;

    }

    update(dt) {
        if (this.alive) {
            this.x += Math.cos(this.ang) * this.speed * dt;
            this.y += Math.sin(this.ang) * this.speed * dt;

            let tailHead = this.tail[0];

            if (Math.hypot(this.x - tailHead.x, this.y - tailHead.y) > gameDefinition.tailDistance) {
                this.tail.unshift({x:this.x, y:this.y});
            }
        }
    }

    setAngularVelocity(keys, dt) {
        if (keys.right) {
            this.ang += this.angSpeed * dt;
        } else if (keys.left) {
            this.ang -= this.angSpeed * dt;
        }
    }

    getSafeTail() {
        let firstSafe =
                this.tail.findIndex(t => Math.hypot(this.x - t.x, this.y - t.y) >
                                    gameDefinition.baseRadius * 2);
        return firstSafe !== -1 ? this.tail.slice(firstSafe) : [];
    }

    collide(otherTail) {
        return otherTail.some(t => Math.hypot(this.x - t.x, this.y - t.y) <
                              gameDefinition.baseRadius * 1.95);
    }
}

function collideCurves(curves) {
    curves.forEach(curve1 => {
        curves.forEach(curve2 => {
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


class Player {
    constructor(curve, mapping) {
        this.curve = curve;
        this.mapping = mapping;
        this.input = { left: false, right: false };
    }

    update(dt) {
        this.curve.setAngularVelocity(this.input, dt);
        this.curve.update(dt);
    }

    addListeners() {
        document.addEventListener("keydown", e => this.mapping.keyDown(e, this.input), false);
        document.addEventListener("keyup", e => this.mapping.keyUp(e, this.input), false);
    }
}

/////// INPUT

class KeyMapping {
    constructor(leftKey, rightKey) {
        this.leftKey = leftKey;
        this.rightKey = rightKey;
    }

    keyDown(e, state) {
        if (e.keyCode === this.leftKey) {
            state.left = true;
        } else if (e.keyCode === this.rightKey) {
            state.right = true;
        }
    }

    keyUp(e, state) {
        if (e.keyCode === this.leftKey) {
            state.left = false;
        } else if (e.keyCode === this.rightKey) {
            state.right = false;
        }
    }
};

const asMapping = new KeyMapping(65, 79);

const uiMapping = new KeyMapping(85, 73);

const arrowsMapping = new KeyMapping(37, 39);


/////// DRAW

function drawCircle(ctx, {x, y}, r, color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawCurve(ctx, curve) {
    ctx.save();
    curve.tail.forEach(t => drawCircle(ctx, t, gameDefinition.baseRadius, curve.color));
    drawCircle(ctx, {x:curve.x, y:curve.y}, gameDefinition.baseRadius, curve.color);
    ctx.restore();
}

function drawGame(ctx, curves) {
    // TODO: game size should be set somewhere else
    ctx.clearRect(0, 0, 700, 700);
    curves.forEach(c => drawCurve(ctx, c));
}


//////// GAME DEFINITION

const gameDefinition =
      { baseSpeed : 100,
        baseRadius: 5,
        baseTurnSpeed: Math.PI,
        tailDistance : 3
      };



//////// MAIN

const c = new Curve(200, 200, 0, "red");
const p = new Player(c, arrowsMapping);

// const ps = [p];

const ps = [new Player(new Curve(200, 200, 0, "red"), arrowsMapping),
            new Player(new Curve(400, 400, Math.PI, "blue"), asMapping)];

const state = {time : 0};

function update(frameTime, ps) {
    let dt = (frameTime - state.time) * 0.001;
    state.time = frameTime;
    ps.forEach(p => p.update(dt));
}


function step(frameTime, ctx, ps) {
    update(frameTime, ps);
    const curves = ps.map(p => p.curve);
    collideCurves(curves);
    drawGame(ctx, curves);
    window.requestAnimationFrame(frameTime => step(frameTime, ctx, ps));
}

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    ps.forEach(p => p.addListeners());

    window.requestAnimationFrame(frameTime => step(frameTime, ctx, ps));
};
