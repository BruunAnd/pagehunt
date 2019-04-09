import Entity, {EntityType} from "./entity";
import Transform from "../transform";
import {WorldLayer} from "../world";

export default class Tree extends Entity {

    constructor(id: number, sprite: HTMLImageElement, solid: boolean, transform?: Transform) {
        super(id, EntityType.Tree, sprite, solid, "Tree", WorldLayer.Environment, transform);
    }

    tick(dt: number) {
        return;
    }
}