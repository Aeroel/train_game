class Entity {
    x;
    y;
    width;
    height;
    constructor({x, y, width, height}) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
    tick({timestamp, context}) {
        this.draw({context});
    }
    draw({context}) {
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

export { Entity}