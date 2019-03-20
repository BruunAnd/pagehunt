import Vector2D from "./vector2d";

export default class Transform {
    position: Vector2D;
    width: number;
    height: number;

    constructor(x, y, width, height) {
        this.position = new Vector2D(x, y);
        this.width = width;
        this.height = height;
    }
}