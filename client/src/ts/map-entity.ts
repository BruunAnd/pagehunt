import Vector2 from "./vector2";

export enum EntityType {
    LocalPlayer = "LPlayer",
    NetworkPlayer = "NPlayer",
    Slender = "Slender",
    Page = "Page",
    Tree = "Tree"
}

export default class MapEntity {
    private picture: HTMLImageElement = null;
    readonly id: number;
    readonly name: string;
    readonly type: EntityType;
    public pos: Vector2 = new Vector2(0, 0);

    constructor(id: number, type: EntityType, name?: string, pos?: Vector2) {
        this.id = id;

        if (type == EntityType.LocalPlayer || type == EntityType.NetworkPlayer) {
            if (name) {
                this.name = name;
            }
            else{
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

        let image = new Image();
        image.addEventListener('load', () => {
            this.picture = image;
        });
        image.src = "/client/graphics/" + type + ".png";
        
        if (pos) {
            this.pos = pos;
        }

        console.log(`Spawned entity '${name}:${this.id}' at position 'x:${this.pos.x}, y:${this.pos.y}'`);
    }

    public occupiesPosition(position: Vector2): boolean {
        return this.pos.x < (position.x + 32) &&
               (this.pos.x + 32) > position.x &&
               this.pos.y > (position.y + 32) &&
               (this.pos.y + 32) < position.y;
    }

    public draw(drawContext: CanvasRenderingContext2D, offset: Vector2): void {
        drawContext.fillStyle = '#FF0000';
        drawContext.fillRect(this.pos.x - offset.x, this.pos.y - offset.y, 32, 32);
        drawContext.fillStyle = '#FFFFFF';
        drawContext.fillText(this.name, this.pos.x - offset.x, (this.pos.y - 8) - offset.y);
    }
}