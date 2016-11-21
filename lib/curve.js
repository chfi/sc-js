export default Curve;

class Curve {
    constructor(x, y, ang, curve) {
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
            this.ang = 0;
        }
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
