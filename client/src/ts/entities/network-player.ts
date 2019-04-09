import {EntityType} from "./entity";
import Transform from "../transform";
import {WorldLayer} from "../world";
import LuminousEntity from "./luminous-entity";

export default class NetworkPlayer extends LuminousEntity {

    constructor(id: number, sprite: HTMLImageElement, solid: boolean, name?: string, transform?: Transform) {
        super(id, EntityType.NetworkPlayer, sprite, solid, name != null ? name : "Unknown Player", WorldLayer.Player,
              100, 10, .4, true, transform);
    }

    tick(dt: number) {
        return;
    }
}