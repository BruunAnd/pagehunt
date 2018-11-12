export default class Vector2 {
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static fromAngle(degree: number): Vector2 {
        let rad = degree * Math.PI / 180;
        return new Vector2(
            Math.sin(rad),
            Math.cos(rad)
        );
    }

    public toString(): String {
        return "Vector2( " + this.x + ", " + this.y + " )";
    }

    public copy(): Vector2 {
        return new Vector2(this.x, this.y)
    }

    public add(other: Vector2): Vector2 {
        return new Vector2(
            this.x + other.x,
            this.y + other.y
        )
    }

    public sub(other: Vector2): Vector2 {
        return this.add(other.negate())
    }

    public negate(): Vector2 {
        return new Vector2(
            -this.x,
            -this.y
        )
    }

    public divide(n: number): Vector2 {
        if (n == 0)
            return new Vector2(0, 0);

        return new Vector2(
            this.x / n,
            this.y / n
        );

    }

    public multiply(n: number): Vector2 {
        return new Vector2(
            this.x * n,
            this.y * n
        )
    }

    public length(): number {
        const x = this.x;
        const y = this.y;
        return Math.sqrt((x * x) + (y * y))
    }

    public normalize(): Vector2 {
        return this.divide(this.length())
    }

    public floor(): Vector2 {
        return new Vector2(
            Math.floor(this.x),
            Math.floor(this.y)
        )
    }

    public ceil(): Vector2 {
        return new Vector2(
            Math.ceil(this.x),
            Math.ceil(this.y)
        )
    }

    public distance(vec: Vector2): number {
        return this.sub(vec).length()
    }

    public normal(): Vector2 {
        return new Vector2(
            -this.y,
            this.x,
        )
    }
}