import Vector2D from './vector2d';
import Entity, {EntityParent, EntityType} from './entities/entity';
import Transform from "./transform";
import Tree from "./entities/tree";
import NetworkPlayer from "./entities/network-player";
import Light from "./entities/light";
import Page from "./entities/page";
import Slender from "./entities/slender";
import packet from "./packets/packet";

export enum WorldLayer {
    Background = 0,
    Pickup = 1,
    Player = 2,
    Environment = 3,
    Foreground = 4
}

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

    public getEntitiesOnLayer(layer: WorldLayer): Entity[] {
        return Array.from(this.worldEntities.values()).filter((ent: Entity) => ent.z === layer);
    }

    public getLuminousEntities(): Entity[] {
        return Array.from(this.worldEntities.values()).filter((ent: Entity) => ent.parent === EntityParent.Luminous)
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

    public constructEntity(data: any): Entity {
        const entity_type: EntityType = data['type'];
        const id: number = data['id'];
        const transform: Transform = new Transform(data['x'], data['y'], 32, 32);
        const solid: boolean = data['solid'];
        const light: number = data['light'] || null;
        const name: string = data['name'] || null;

        switch (entity_type) {
            case EntityType.Tree:
                return new Tree(id, null, solid, transform);
            case EntityType.NetworkPlayer:
                return new NetworkPlayer(id, null, solid, name, transform);
            case EntityType.Light:
                return new Light(id, null, solid, light, transform);
            case EntityType.Page:
                return new Page(id, null, solid, transform);
            case EntityType.LocalPlayer:
                console.error("Local player is not a valid entity to be constructed by using the World.constructEntity function");
                return null;
            default:
                return new Slender(id, null, solid, transform);
        }
    }
}