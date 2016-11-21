import { gameDefinition } from "./gameDefinition.js";

export { drawGame };

function drawCircle(ctx, {x, y}, r) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawCurve(ctx, curve) {
    ctx.save();
    curve.tail.forEach(t => drawCircle(ctx, t, gameDefinition.baseRadius));
    drawCircle(ctx, {x:curve.x, y:curve.y}, gameDefinition.baseRadius);
    ctx.restore();
}

function drawGame(ctx, curves) {
    // TODO: game size should be set somewhere else
    ctx.clearRect(0, 0, 500, 500);
    curves.forEach(c => drawCurve(ctx, c));
}
