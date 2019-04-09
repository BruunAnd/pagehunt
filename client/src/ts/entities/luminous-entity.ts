import Entity, {EntityParent, EntityType} from "./entity";
import Transform from "../transform";
import {WorldLayer} from "../world";

export default class LuminousEntity extends Entity {
    light: number;
    readonly lightDensity: number;
    private readonly minLightLevel: number;

    constructor(id: number, type: EntityType, sprite: HTMLImageElement, solid: boolean, name: string, z: WorldLayer, initialLightLevel: number,
                minimumLightLevel: number,  lightDensity: number, staticLight: boolean, transform?: Transform) {
        super(id, type, sprite, solid, name, z, transform);

        this.light = initialLightLevel;
        this.lightDensity = lightDensity;
        this.minLightLevel = minimumLightLevel;
        this.parent = EntityParent.Luminous;
    }

    public hasLight(): boolean {
        return this.light >= this.minLightLevel;
    }

    tick(dt: number) {
        if (this.hasLight()) {
            this.light -= .1;
        }
    }
}