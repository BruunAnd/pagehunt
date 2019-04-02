import Vector2D from "../vector2d";
import Transform from "../transform";
import Tree from "./tree";
import Light from "./light";
import Page from "./page";
import NetworkPlayer from "./network-player";
import Slender from "./slender";

export enum EntityType {
    Player = 10,
    Slender = 11,
    Page = 12,
    Light = 13,
    Fireball = 14,
    Tree = 15,
    LocalPlayer = 20,
    NetworkPlayer = 21
}

export default abstract class Entity {
    readonly id: number;
    readonly type: EntityType;
    readonly sprite: HTMLImageElement = null;
    readonly name: string;
    readonly transform: Transform;

    protected constructor(id: number, type: EntityType, sprite: HTMLImageElement, name: string, transform?: Transform) {
        this.id = id;
        this.type = type;
        this.sprite = sprite;
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