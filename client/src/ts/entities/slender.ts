import Entity, {EntityType} from "./entity";
import Transform from "../transform";

export default class Slender extends Entity {

    constructor(id: number, sprite: HTMLImageElement, transform?: Transform) {
        super(id, EntityType.Slender, sprite, "Slender", transform);
    }

    tick(dt: number) {
        return;
    }
}