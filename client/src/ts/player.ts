import MapEntity, { EntityType } from "./map-entity";
import Vector2 from "./vector2";
import Map from "./map";

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

    public move(newPos: Vector2, map: Map): void {
        //Check if we are trying to move out of the map
        if (newPos.x < 0                   ||
           (newPos.x + 32) > map.mapSize.x ||
           newPos.y < 0                    ||
           (newPos.y + 32) > map.mapSize.y) {
                //newPos is outside map boundries
                return;
        }

        //Preliminary collision checking
        for (let ent of map.getMapEntities()) {
            if (ent.occupiesPosition(newPos)) {
                //Position is occupied, cannot move!
                return;
            }
        }
        
        this.pos = newPos;
    }

    public draw(drawContext: CanvasRenderingContext2D, offset: Vector2): void {
        drawContext.fillStyle = '#00FF00';
        drawContext.fillRect(this.pos.x - offset.x, this.pos.y - offset.y, 32, 32);
        drawContext.fillStyle = '#FFFFFF';
        drawContext.fillText(this.name, this.pos.x - offset.x, (this.pos.y - 8) - offset.y);
    }
}
