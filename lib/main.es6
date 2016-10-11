/* jshint esversion: 6 */

const gameDefinition =
          { baseSpeed : 100,
            baseRadius: 5,
            baseTurnSpeed: Math.PI,
            tailDistance : 3
          };


class Player {
    constructor(x, y, ang) {
        this.x = x;
        this.y = y;

        this.ang = ang;
        this.angSpeed = gameDefinition.baseTurnSpeed;

        this.speed = gameDefinition.baseSpeed;

        this.tail = [{x:x, y:y}];

        this.color = "red";

    }

    update(dt) {
        this.x += Math.cos(this.ang) * this.speed * dt;
        this.y += Math.sin(this.ang) * this.speed * dt;

        let tailHead = this.tail[0];

        if (Math.hypot(this.x - tailHead.x, this.y - tailHead.y) > gameDefinition.tailDistance) {
            this.tail.unshift({x:this.x, y:this.y});
        }
    }

    setAngularVelocity(keys, dt) {
        if (keys.right) {
            this.ang += this.angSpeed * dt;
        } else if (keys.left) {
            this.ang -= this.angSpeed * dt;
        } else {
            this.dx = 0;
        }
    }

    setVelocity(keys) {
        if (keys.right) {
            this.dx = this.speed;
        } else if (keys.left) {
            this.dx = -this.speed;
        } else {
            this.dx = 0;
        }

        if (keys.up) {
            this.dy = -this.speed;
        } else if (keys.down) {
            this.dy = this.speed;
        } else {
            this.dy = 0;
        }
    }

    draw(ctx) {
        const st = this.getSafeTail();
        ctx.save();
        this.tail.forEach(t => drawCircle(ctx, t, gameDefinition.baseRadius));

        if (this.collide(st)) {
            console.log("colliding");
            ctx.save();
            ctx.fillStyle = "red";
            drawCircle(ctx, {x:this.x, y:this.y}, gameDefinition.baseRadius);
            ctx.restore();
        } else {
            drawCircle(ctx, {x:this.x, y:this.y}, gameDefinition.baseRadius);
        }
        // drawCircle(ctx, {x:this.x, y:this.y}, gameDefinition.baseRadius);
        ctx.restore();
    }

    getSafeTail() {
        let firstSafe =
                this.tail.findIndex(t => Math.hypot(this.x - t.x, this.y - t.y) >
                                    gameDefinition.tailDistance);
        return typeof firstSafe === "number" ? this.tail.slice(firstSafe) : [];
    }

    collide(otherTail) {
        return otherTail.some(t => Math.hypot(this.x - t.x, this.y - t.y) <
                              gameDefinition.tailDistance);
    }
}


function drawCircle(ctx, {x, y}, r) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

const p = new Player(200, 200, 0);
const keys = {left: false, right: false, up: false, down: false};
const state = {time : 0};

function update(frameTime, p, keys) {
    // convert dt to seconds
    let dt = (frameTime - state.time) * 0.001;
    state.time = frameTime;
    p.setAngularVelocity(keys, dt);
    p.update(dt);
}

function draw(ctx, p) {
    // TODO fix magic numbers
    ctx.clearRect(0, 0, 500, 500);
    p.draw(ctx);
    // drawCircle(ctx, p, 10);
}

function step(dt, ctx, p, keys) {
    update(dt, p, keys);
    draw(ctx, p);
    window.requestAnimationFrame(dt => step(dt, ctx, p, keys));
}

function keyDownHandler(e) {
    if (e.keyCode === 39) {
        keys.right = true;
    } else if (e.keyCode === 37) {
        keys.left = true;
    } else if (e.keyCode === 40) {
        keys.down = true;
    } else if (e.keyCode === 38) {
        keys.up = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode === 39) {
        keys.right = false;
    } else if (e.keyCode === 37) {
        keys.left = false;
    } else if (e.keyCode === 40) {
        keys.down = false;
    } else if (e.keyCode === 38) {
        keys.up = false;
    }
}

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    window.requestAnimationFrame(dt => step(dt, ctx, p, keys));
};
