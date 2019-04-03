import Entity, {EntityType} from "./entity";
import Transform from "../transform";

export default class Tree extends Entity {

    constructor(id: number, sprite: HTMLImageElement, transform?: Transform) {
        super(id, EntityType.Tree, sprite, "Tree", 2, transform);
    }

    tick(dt: number) {
        return;
    }
}