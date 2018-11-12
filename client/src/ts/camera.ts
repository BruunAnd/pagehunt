import Vector2 from "./vector2";

export default class Camera {
    cameraMovementSpeed: number = 7;
    private position: Vector2;
    private targetPosition: Vector2;
    private screenSize: Vector2;
    private sizeModifier: number;

    constructor(position: Vector2, canvas: HTMLCanvasElement) {
        this.position = position;

        this.screenSize = new Vector2(canvas.width, canvas.height);
        this.sizeModifier = Math.max(canvas.width, canvas.height) / 10;
    }

    public setPosition(position: Vector2): void {
        this.targetPosition = new Vector2(position.x - (this.screenSize.x / 2), position.y - (this.screenSize.y / 2));
    }

    public getPosition(): Vector2 {
        return this.position;
    }

    public tick(): void {
        if (this.targetPosition && this.position != this.targetPosition) {
            const dist = this.targetPosition.sub(this.position).length();

            if (dist < 1){
                this.position = this.targetPosition;
            }
            else {
                const speed = 10 * (dist / 200);
                const dir = this.targetPosition.sub(this.position).normalize().multiply(speed);
                this.position = this.position.add(dir);
            }
        }
    }

    public onResize(canvas: HTMLCanvasElement){
        this.screenSize = new Vector2(canvas.width, canvas.height);
        this.sizeModifier = Math.max(canvas.width, canvas.height) / 10;
    }
}