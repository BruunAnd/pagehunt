import Vector2D from './vector2d';
import Entity, {EntityType} from './entities/entity';
import Transform from "./transform";
import Tree from "./entities/tree";
import NetworkPlayer from "./entities/network-player";
import Light from "./entities/light";
import Page from "./entities/page";
import Slender from "./entities/slender";

export default class World {
    readonly worldSize: Vector2D;
    private worldEntities: Map<number, Entity>;

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

    public getEntitiesOnLayer(layer: number): Entity[] {
        return Array.from(this.worldEntities.values()).filter((ent: Entity) => ent.z === layer);
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

    public constructEntity(entity: any): Entity {
        const entity_type: EntityType = entity['type'];
        const id: number = entity['id'];
        const transform = new Transform(entity['x'], entity['y'], 32, 32);
        const name: string = entity['name'] ? entity['name'] : null;

        switch (entity_type) {
            case EntityType.Tree:
                return new Tree(id, null, transform);
            case EntityType.Player || EntityType.NetworkPlayer:
                return new NetworkPlayer(id, null, name, transform);
            case EntityType.Light:
                return new Light(id, null, 20, transform);
            case EntityType.Page:
                return new Page(id, null, transform);
            case EntityType.LocalPlayer:
                console.error("Local player is not a valid entity to be constructed by using the World.constructEntity function");
                return null;
            default:
                return new Slender(id, null, transform);
        }
    }
}