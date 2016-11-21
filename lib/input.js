export { KeyMapping, adMapping, fgMapping, arrowsMapping, fart };

class KeyMapping {
    constructor(left, right) {
        this.left = left;
        this.right = right;
    }

    keyDown(e) {
        if (e.keyCode === this.left) {
            this.left = true;
        } else if (e.keyCode === this.right) {
            this.right = true;
        }
    }

    keyUp(e) {
        if (e.keyCode === this.left) {
            this.left = false;
        } else if (e.keyCode === this.right) {
            this.right = false;
        }
    }
};

var fart = "butt";

const adMapping = new KeyMapping();

const fgMapping = new KeyMapping();

const arrowsMapping = new KeyMapping(37, 39);
