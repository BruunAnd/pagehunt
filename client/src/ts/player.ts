import MapEntity, { EntityType } from "./mapentity";
import Vector2 from "./vector2";

export default class Player extends MapEntity {
    constructor(id: number, name?: string, pos?: Vector2) {
        if (name) {
            if (pos) {
                super(id, EntityType.LocalPlayer, name, pos);
            }
            else {
                super(id, EntityType.LocalPlayer, name);
            }
        }
        else {
            super(id, EntityType.LocalPlayer);
        }
        
    }

    public move(newPos: Vector2) {
        //Send direction to server

        //Make prediction for movement and start moving

        //Correct position based on server feedback
        this.pos = newPos;
    }

    public draw(drawContext: CanvasRenderingContext2D) {
        drawContext.fillStyle = '#00FF00';
        drawContext.fillRect(this.pos.x, this.pos.y, 32, 32);
    }
}
