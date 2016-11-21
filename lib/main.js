/* jshint esversion: 6 */

// import * as Player from "./player.js";
// import * as Curve from "./curve.js";
// import { Curve } from "./curve.js";
import Curve from "./curve.js";
import { Player } from "./player.js";
import * as Input from "./input.js";
import { drawGame } from "./draw.js";

// const p = new Player(200, 200, 0);
console.log(Input);
const c = new Curve(200, 200, 0);
// const m = new Input.KeyMapping()
const p = new Player(c, Input.adMapping);
const keys = {left: false, right: false, up: false, down: false};
const state = {time : 0};

function update(frameTime, p, keys) {
    // convert dt to seconds
    let dt = (frameTime - state.time) * 0.001;
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
    drawGame(ctx, [p.curve]);
    window.requestAnimationFrame(dt => step(dt, ctx, p, keys));
}

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // document.addEventListener("keydown", keyDownHandler, false);
    // document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("keydown", p.mapping.keyDown, false);
    document.addEventListener("keyup", p.mapping.keyUp, false);

    window.requestAnimationFrame(dt => step(dt, ctx, p, keys));
};
