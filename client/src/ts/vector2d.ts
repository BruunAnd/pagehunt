export default class Vector2D {
    readonly x: number;
    readonly y: number;

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

    public toString(): String {
        return "Vector2D( " + this.x + ", " + this.y + " )";
    }

    public equals(other: Vector2D): boolean {
        return this.x == other.x && this.y == other.y;
    }

    public copy(): Vector2D {
        return new Vector2D(this.x, this.y)
    }

    public add(other: Vector2D): Vector2D {
        return new Vector2D(
            this.x + other.x,
            this.y + other.y
        )
    }

    public sub(other: Vector2D): Vector2D {
        return this.add(other.negate())
    }

    public negate(): Vector2D {
        return new Vector2D(
            -this.x,
            -this.y
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
            Math.floor(this.x),
            Math.floor(this.y)
        )
    }

    public ceil(): Vector2D {
        return new Vector2D(
            Math.ceil(this.x),
            Math.ceil(this.y)
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