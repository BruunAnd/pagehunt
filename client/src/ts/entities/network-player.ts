import Entity, {EntityType} from "./entity";
import Transform from "../transform";

export default class NetworkPlayer extends Entity {

    constructor(id: number, sprite: HTMLImageElement, name?: string, transform?: Transform) {
        super(id, EntityType.NetworkPlayer, sprite, name != null ? name : "Unknown Player", transform);
    }

    tick(dt: number) {
        return;
    }
}