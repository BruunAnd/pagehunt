import Entity, {EntityType} from "./entity";
import Transform from "../transform";

export default class Page extends Entity {

    constructor(id: number, sprite: HTMLImageElement, transform?: Transform) {
        super(id, EntityType.Tree, sprite, "Page", transform);
    }

    tick(dt: number) {
        return;
    }
}