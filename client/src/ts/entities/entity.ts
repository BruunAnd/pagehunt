import Vector2D from "../vector2d";
import Transform from "../transform";
import World from "../world";

export enum EntityType {
    LocalPlayer = 0,
    NetworkPlayer = 1,
    Slender = 2,
    Page = 3,
    Light = 4,
    Tree = 5
}

export default abstract class Entity {
    readonly world: World;
    readonly sprite: HTMLImageElement = null;
    readonly id: number;
    readonly type: EntityType;
    readonly name: string;
    readonly transform: Transform;

    protected constructor(id: number, type: EntityType, sprite: HTMLImageElement, world: World, name: string, transform?: Transform) {
        this.id = id;
        this.type = type;
        this.sprite = sprite;
        this.world = world;
        this.name = name;
        this.transform = transform != null ? transform : new Transform(10,10, 32, 32);
    }

    public abstract tick(dt: number);

    public occupiesPosition(position: Vector2D): boolean {
        const a = Math.min(this.transform.position.x + this.transform.width, position.x + this.transform.width) - Math.max(this.transform.position.x, position.x);
        const b = Math.min(this.transform.position.y + this.transform.height, position.y + this.transform.height) - Math.max(this.transform.position.y, position.y);
        return (a >= 0) && (b >= 0);
    }

    public getPosition() {
        return this.transform.position;
    }
}