import Vector2 from "./vector2";
import MapEntity from "./mapentity";

export default class Map {
    mapSize: Vector2;
    mapEntities: MapEntity[] = [];

    constructor(size: Vector2) {
        this.mapSize = size;
    }

    public addMapEntities(entities: MapEntity[]): void {
        for (const ent of entities) {
            this.mapEntities.push(ent);
        }
    }

    public getMapEntities(): MapEntity[] {
        return this.mapEntities;
    }
}