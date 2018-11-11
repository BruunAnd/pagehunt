import Vector2 from "./vector2";

export enum EntityType {
    LocalPlayer = "LPlayer",
    NetworkPlayer = "NPlayer",
    Slender = "Slender",
    Page = "Page",
    Tree = "Tree"
}

export default class MapEntity {
    public id: number;
    public pos: Vector2 = new Vector2(0, 0);
    name: string;
    type: EntityType;

    constructor(id: number, type: EntityType, name?: string, pos?: Vector2) {
        this.id = id;

        if (type == EntityType.LocalPlayer || type == EntityType.NetworkPlayer) {
            if (!name) {
                this.name = "Unknown Player";
            }
        }
        else if (type == EntityType.Slender) {
            this.name = "Slenderman";
        }
        else {
            if (name) {
                this.name = name;
            }
            else {
                this.name = type;
            }
        }
        
        if (pos) {
            this.pos = pos;
        }

        console.log(`Spawned entity '${name}:${this.id}' at position 'x:${this.pos.x}, y:${this.pos.y}'`);
    }

    public occupiesPosition(position: Vector2): boolean {
        if (this.pos.x < (position.x + 32) &&
           (this.pos.x + 32) > position.x  &&
           this.pos.y > (position.y + 32)  &&
           (this.pos.y + 32) < position.y) {
            return true;
        }
        return false;
    }

    public draw(drawContext: CanvasRenderingContext2D) {
        drawContext.fillStyle = '#FF0000';
        drawContext.fillRect(this.pos.x, this.pos.y, 32, 32);
    }
}