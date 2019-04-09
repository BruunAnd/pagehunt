import Entity, {EntityType} from "./entity";
import Transform from "../transform";
import {WorldLayer} from "../world";

export default class Slender extends Entity {

    constructor(id: number, sprite: HTMLImageElement, solid: boolean, transform?: Transform) {
        super(id, EntityType.Slender, sprite, solid, "Slender", WorldLayer.Player, transform);
    }

    tick(dt: number) {
        return;
    }
}