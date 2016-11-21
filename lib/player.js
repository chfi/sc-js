export { Player };

class Player {
    constructor(curve, mapping) {
        this.curve = curve;
        this.mapping = mapping;
        this.input = { left: false, right: false };
    }

    update(dt) {
        this.curve.setAngularVelocity(this.input, dt);
    }

    addListeners() {
        document.addEventListener("keydown", this.mapping.keyDown, false);
        document.addEventListener("keyup", this.mapping.keyUp, false);
    }
}
