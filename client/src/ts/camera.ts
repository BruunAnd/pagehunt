import Vector2D from "./vector2d";

export default class Camera {
    cameraMovementSpeed: number = 7;
    private position: Vector2D;
    private targetPosition: Vector2D;
    private screenSize: Vector2D;
    private sizeModifier: number;

    constructor(position: Vector2D, canvas: HTMLCanvasElement) {
        this.position = position;

        this.screenSize = new Vector2D(canvas.width, canvas.height);
        this.sizeModifier = Math.max(canvas.width, canvas.height) / 10;
    }

    public tick(dt: number): void {
        if (this.targetPosition && this.position != this.targetPosition) {
            const dist = this.targetPosition.sub(this.position).length();

            if (dist < 1) {
                this.position = this.targetPosition;
            } else {
                const speed = (10 * (dist / 200) * dt);
                const dir = this.targetPosition.sub(this.position).normalize().multiply(speed);
                this.position = this.position.add(dir);
            }
        }
    }

    public setPosition(position: Vector2D): void {
        this.targetPosition = new Vector2D(position.x - (this.screenSize.x / 2), position.y - (this.screenSize.y / 2));
    }

    public getPosition(): Vector2D {
        return this.position;
    }

    public onResize(canvas: HTMLCanvasElement){
        this.screenSize = new Vector2D(canvas.width, canvas.height);
        this.sizeModifier = Math.max(canvas.width, canvas.height) / 10;
    }
}