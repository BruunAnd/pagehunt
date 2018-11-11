import Vector2D from "./vector2new";

export default class Camera {
    cameraMovementSpeed: number = 0.14;

    private isAutoMoving: boolean;
    private moveTo: Vector2D;
    private position: Vector2D;

    constructor(position: Vector2D) {
        this.position = position;
        this.isAutoMoving = false;
        this.moveTo = new Vector2D(0, 0)
    }

    public getPosition(): Vector2D {
        return this.position.copy()
    }

    public setPosition(position: Vector2D): void {
        if (this.moveToPosition) {
            this.moveTo = position
        } else {
            this.position = position;
        }
    }

    public addPositon(toAdd: Vector2D): void {
        if (!this.isAutoMoving)
            this.position = this.position.add(toAdd);

        // todo fix
        /*this.position.setMaxLimit(new Vector2D(10, 10))
         this.position.setMinLimit(new Vector2D(0, 0)) */
    }

    public moveToPosition(pos: Vector2D): void {
        this.moveTo = pos;
        this.isAutoMoving = true
    }

    public tick(): void {
        if (this.isAutoMoving) {
            const dist = this.moveTo.sub(this.position).length();

            if (dist < this.cameraMovementSpeed) {
                this.isAutoMoving = false;
                this.position = this.moveTo
            } else {
                const dir = this.moveTo.sub(this.position).normalize().multiply(this.cameraMovementSpeed);
                this.position = this.position.add(dir)
            }
        }
    }

    public isCameraAutoMoving(): boolean {
        return this.isAutoMoving
    }

    public onPlayerPositionUpdate(position: Vector2D) {
        if (this.isAutoMoving) {
            return
        }

        this.position = position
    }
}