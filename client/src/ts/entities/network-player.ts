import Entity, {EntityType} from "./entity";
import World from "../world";
import Transform from "../transform";

export default class NetworkPlayer extends Entity {

    constructor(id: number, sprite: HTMLImageElement, world: World, name?: string, transform?: Transform) {
        super(id, EntityType.NetworkPlayer, sprite, world, name != null ? name : "Unknown Player", transform);
    }

    tick(dt: number) {
        return;
    }
}