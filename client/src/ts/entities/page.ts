import Entity, {EntityType} from "./entity";
import Transform from "../transform";
import {WorldLayer} from "../world";

export default class Page extends Entity {

    constructor(id: number, sprite: HTMLImageElement, solid: boolean, transform?: Transform) {
        super(id, EntityType.Tree, sprite, solid, "Page", WorldLayer.Pickup, transform);
    }

    tick(dt: number) {
        return;
    }
}