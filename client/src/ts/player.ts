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

        console.log("Direction: " + direction);

        console.log("x: " + Math.cos(direction * Math.PI / 180));
        console.log("y: " + Math.sin(direction * Math.PI / 180));

        this.pos = new Vector2(this.pos.x + distance * Math.cos(direction * Math.PI / 180), this.pos.y + distance * Math.sin(direction * Math.PI / 180));
    }
}
