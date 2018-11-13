import Vector2 from "./vector2";

export enum EntityType {
    LocalPlayer = "LPlayer",
    NetworkPlayer = "NPlayer",
    Slender = "Slender",
    Page = "Page",
    Light = "Light",
    Tree = "Tree"
}

export default class MapEntity {
    private picture: HTMLImageElement = null;
    readonly id: number;
    readonly name: string;
    readonly type: EntityType;
    readonly width: number = 32;
    readonly height: number = 32;
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
        const a = Math.min(this.pos.x + this.width, position.x + this.width) - Math.max(this.pos.x, position.x);
        const b = Math.min(this.pos.y + this.height, position.y + this.height) - Math.max(this.pos.y, position.y);
        return (a >= 0) && (b >= 0);

    }

    public draw(drawContext: CanvasRenderingContext2D, offset: Vector2): void {
        drawContext.beginPath();
        drawContext.fillStyle = '#FF0000';
        drawContext.fillRect(this.pos.x - offset.x, this.pos.y - offset.y, this.width, this.height);
        drawContext.fillStyle = '#FFFFFF';
        drawContext.fillText(this.name, this.pos.x - offset.x, (this.pos.y - 8) - offset.y);
        drawContext.stroke();
        drawContext.closePath();
    }
}