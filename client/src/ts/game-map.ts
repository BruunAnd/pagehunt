import Vector2D from './vector2d';
import MapEntity from './entities/map-entity';

export default class GameMap {
    mapSize: Vector2D;
    mapEntities: Map<number, MapEntity>;

    constructor(size: Vector2D) {
        this.mapSize = size;
        this.mapEntities = new Map<number, MapEntity>();
    }

    public addEntity(entities: MapEntity[]): void {
        for (const ent of entities) {
            this.mapEntities.set(ent.id, ent);
        }
    }

    public getEntities(): MapEntity[] {
        return Array.from(this.mapEntities.values());
    }

    public getEntity(id: number): MapEntity {
        if (!this.mapEntities.has(id)) {
            return null;
        }

        return this.mapEntities.get(id);
    }

    public removeEntity(id: number):void {
        if (!this.mapEntities.has(id)) {
            return;
        }

        this.mapEntities.delete(id);
        console.log(`Despawned entity with ID '${id}'.`);
    }
}