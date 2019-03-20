import Vector2D from './vector2d';
import Entity from './entities/entity';

export default class World {
    worldSize: Vector2D;
    worldEntities: Map<number, Entity>;

    constructor(size: Vector2D) {
        this.worldSize = size;
        this.worldEntities = new Map<number, Entity>();
    }

    public addEntity(entity: Entity): void {
        this.worldEntities.set(entity.id, entity);
    }

    public getAllEntities(): Entity[] {
        return Array.from(this.worldEntities.values());
    }

    public getEntity(id: number): Entity {
        if (!this.worldEntities.has(id)) {
            return null;
        }

        return this.worldEntities.get(id);
    }

    public removeEntity(id: number):void {
        if (!this.worldEntities.has(id)) {
            return;
        }

        this.worldEntities.delete(id);
        console.log(`Despawned entity with ID '${id}'.`);
    }
}