import MapEntity from "./mapentity"
import Vector2 from "./vector2";

export default class Player extends MapEntity {
    constructor(name: string) {
        super(1, name);
    }

    public move(direction: number, distance: number) {
        //Send direction to server

        //Make prediction for movement and start moving

        //Correct position based on server feedback

        this.pos = new Vector2(this.pos.x + distance * Math.sin(direction), this.pos.y + distance * Math.sin(direction));
    }
}
