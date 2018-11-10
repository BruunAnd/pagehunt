import Vector2 from "./vector2";
import MapEntity from "./mapentity";

export default class Map {
    mapSize: Vector2;
    mapEntities: MapEntity[] = [];

    constructor(size: Vector2, entities?: MapEntity[]) {
        this.mapSize = size;
        this.mapEntities = entities;
    }

    public addMapEntities(enteties: MapEntity[]) {
        for (let ent of enteties) {
            this.mapEntities.push(ent);
        }
    }

    public getMapEntities(): MapEntity[] {
        return this.mapEntities;
    }
}