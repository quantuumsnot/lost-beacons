class AttackFollow extends Behavior {

    constructor(target) {
        super();
        this.target = target;
        this.nextCheck = 0;
    }

    updateSubBehavior() {
        if (dist(this.unit, this.target) < UNIT_ATTACK_RADIUS && !W.hasObstacleBetween(this.unit, this.target)) {
            // Target is visible, attack!
            // TODO also check that target is alive
            this.subBehavior = new AttackStill(this.target);
        } else {
            const path = W.findPath(this.unit, this.target, position => {
                return dist(position, this.target) <= GRID_SIZE / 2;
            });

            if (path) {
                // TODO put these in World
                path[path.length - 1] = {'x': this.target.x, 'y': this.target.y};
                path.shift(); // kinda risky, but the first step is very often a step back
                this.subBehavior = new FollowPath(path);
            }
        }
    }

    cycle(e) {
        this.nextCheck -= e;
        if (this.nextCheck <= 0) {
            this.nextCheck = 1;
            this.updateSubBehavior();
        }

        if (this.subBehavior) {
            this.subBehavior.unit = this.unit;
            this.subBehavior.cycle(e);
        }
    }

    reconsider() {
        // TODO if target is destroyed, switch to still
        return this;
    }

    render() {
        this.subBehavior.render();
    }

}