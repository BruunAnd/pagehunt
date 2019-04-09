import {EntityType} from "./entity";
import Transform from "../transform";
import {WorldLayer} from "../world";
import LuminousEntity from "./luminous-entity";

export default class Light extends LuminousEntity {

    constructor(id: number, sprite: HTMLImageElement, solid: boolean, value?: number, transform?: Transform) {
        super(id, EntityType.Light, sprite, solid, "Light", WorldLayer.Pickup, 60, 0, .4, false, transform);
    }

    tick(dt: number) {
        return;
    }
}