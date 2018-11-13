import Vector2 from './vector2';
import MapEntity from './map-entity';

export default class GameMap {
    mapSize: Vector2;
    mapEntities: Map<number, MapEntity>;

    constructor(size: Vector2) {
        this.mapSize = size;
        this.mapEntities = new Map<number, MapEntity>();
    }

    public addMapEntities(entities: MapEntity[]): void {
        for (const ent of entities) {
            this.mapEntities[ent.id] = ent;
        }
        console.log(this.mapEntities);
    }

    public getMapEntities(): MapEntity[] {
        return Array.from(this.mapEntities.values());
    }

    public getMapEntityByID(id: number): MapEntity {
        if (!this.mapEntities.has(id)) {
            console.log(`Unable to find id ${id}`);
            return null;
        }

        return this.mapEntities.get(id);
    }

    public removeMapEntityByID(id: number):void {
        if (!this.mapEntities.has(id)) {
            console.log(`Unable to find id ${id}`);
            return;
        }

        const ent = this.getMapEntityByID(id);
        console.log(`Despawned entity '${ent.name}:${ent.id}'`);
        this.mapEntities.delete(id);
    }
}