import Vector2 from "./vector2";

export default class Camera {
    cameraMovementSpeed: number = 0.14;
    private position: Vector2;
    private targetPosition: Vector2;

    constructor(position: Vector2) {
        this.position = position;
    }

    public setPosition(position: Vector2): void {
        this.targetPosition = position;
    }

    public tick(): void {
        if (this.targetPosition && this.position != this.targetPosition) {
            const dist = this.targetPosition.sub(this.position).length();

            if (dist < this.cameraMovementSpeed) {
                this.position = this.targetPosition;
            } else {
                const dir = this.targetPosition.sub(this.position).normalize().multiply(this.cameraMovementSpeed);
                this.position = this.position.add(dir);
            }
        }
    }
}