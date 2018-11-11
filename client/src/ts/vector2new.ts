export default class Vector2D {
    private x: number;
    private y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static fromAngle(degree: number): Vector2D {
        let rad = degree * Math.PI / 180;
        return new Vector2D(
            Math.sin(rad),
            Math.cos(rad)
        );
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public toString(): String {
        return "Vector2D( " + this.x + ", " + this.y + " )";
    }

    public copy(): Vector2D {
        return new Vector2D(this.x, this.y)
    }

    public add(other: Vector2D): Vector2D {
        return new Vector2D(
            this.getX() + other.getX(),
            this.getY() + other.getY()
        )
    }

    public sub(other: Vector2D): Vector2D {
        return this.add(other.negate())
    }

    public negate(): Vector2D {
        return new Vector2D(
            -this.getX(),
            -this.getY()
        )
    }

    public divide(n: number): Vector2D {
        if (n == 0)
            return new Vector2D(0, 0);

        return new Vector2D(
            this.x / n,
            this.y / n
        );

    }

    public multiply(n: number): Vector2D {
        return new Vector2D(
            this.x * n,
            this.y * n
        )
    }

    // cannot set vector to under vec
    public setMinLimit(vec: Vector2D) {
        this.x = Math.max(this.x, vec.x);
        this.y = Math.max(this.y, vec.y)
    }

    public setMaxLimit(vec: Vector2D) {
        this.x = Math.min(this.x, vec.getX());
        this.y = Math.min(this.y, vec.getY())
    }

    public length(): number {
        const x = this.x;
        const y = this.y;
        return Math.sqrt((x * x) + (y * y))
    }

    public normalize(): Vector2D {
        return this.divide(this.length())
    }

    public floor(): Vector2D {
        return new Vector2D(
            Math.floor(this.getX()),
            Math.floor(this.getY())
        )
    }

    public ceil(): Vector2D {
        return new Vector2D(
            Math.ceil(this.getX()),
            Math.ceil(this.getY())
        )
    }

    public distance(vec: Vector2D): number {
        return this.sub(vec).length()
    }

    public normal(): Vector2D {
        return new Vector2D(
            -this.y,
            this.x,
        )
    }
}