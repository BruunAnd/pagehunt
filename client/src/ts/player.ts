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

    public move(newPos: Vector2, map: Map): Vector2 {
        let correctX: number = newPos.x;
        let correctY: number = newPos.y;
        //Check if we are trying to move out of the map
        if (newPos.x < 0){
            //newPos is to the left of the map boundary
            correctX = 1;
        }
        if (newPos.y < 0){
            //newPos is above the map boundary
            correctY = 1;
        }
        if ((newPos.x + this.width) > map.mapSize.x){
            //newPos is to the right of the map boundary
            correctX = map.mapSize.x - (this.width + 1);
        }
        if ((newPos.y + this.height) > map.mapSize.y) {
            //newPos is below the map boundary
            correctY = map.mapSize.y - (this.height + 1);
        }

        let correctPos = new Vector2(correctX, correctY);
        if (!newPos.equals(correctPos)) {
            console.log("Collided with map boundary");
            this.pos = correctPos;
            return correctPos;
        }


        let canMove: boolean = true;

        //Preliminary collision checking
        for (let ent of map.getMapEntities()) {
            if (ent.occupiesPosition(newPos)) {
                if (ent.id == this.id)
                    //Don't check our own collision :D
                    continue;
                //Position is occupied, cannot move!
                console.log(`${this.name} collided with ${ent.name}`);
                canMove = this.onCollision(ent);
            }
        }

        if (canMove) {
            this.pos = newPos;
            return newPos;
        }

        return this.pos;
    }

    private onCollision(other: MapEntity): boolean {
        switch (other.type) {
            case EntityType.Page:
                //Collect and move
                return true;
            case EntityType.Slender:
                //Death
                return true;
            default:
                //Blocked
                return false;
        }
    }

    public draw(drawContext: CanvasRenderingContext2D, offset: Vector2): void {
        drawContext.fillStyle = '#00FF00';
        drawContext.fillRect(this.pos.x - offset.x, this.pos.y - offset.y, this.width, this.height);
        drawContext.fillStyle = '#FFFFFF';
        drawContext.fillText(this.name, this.pos.x - offset.x, (this.pos.y - 8) - offset.y);
    }
}
