import Vector2 from "./vector2";

export default class MapEntity {
    id: number;
    pos: Vector2 = new Vector2(0, 0);
    name: string;

    constructor(id: number, name: string, pos?: Vector2) {
        this.id = id;
        this.name = name;

        if (pos) {
            this.pos = pos;
        }

        console.log(`Spawned entity '${name}:${this.id}' at position 'x:${this.pos.x}, y:${this.pos.y}'`);
    }

    public draw(drawContext: CanvasRenderingContext2D) {
        drawContext.fillRect(this.pos.x, this.pos.y, 32, 32);
    }
}