import Entity, {EntityType} from "./entity";
import Transform from "../transform";

export default class Light extends Entity {

    constructor(id: number, sprite: HTMLImageElement, value?: number, transform?: Transform) {
        super(id, EntityType.Light, sprite, "Light", 0, transform);
    }

    tick(dt: number) {
        return;
    }
}