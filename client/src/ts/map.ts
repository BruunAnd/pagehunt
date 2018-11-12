import Vector2 from './vector2';
import MapEntity from './map-entity';

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

    public removeMapEntityByID(id: number){
       let entity: MapEntity = null;
        for (let ent of this.mapEntities) {
            if (ent.id == id){
                entity = ent;
                break;
            }
        }

        if (entity){
            console.log(`Despawned entity '${entity.name}:${entity.id}'`);
            this.mapEntities.splice(this.mapEntities.indexOf(entity), 1);
        }
    }
}