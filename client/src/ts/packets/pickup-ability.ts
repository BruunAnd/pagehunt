import Packet, {PacketType} from './packet';
import {EntityType} from "../entities/entity";

export default class PickupAbilityPacket extends Packet {
    ability: EntityType;
    light: number;

    constructor(packetDict: any) {
        super(PacketType.PickupAbility);

        this.ability = packetDict['ability'];
        this.light = packetDict['light'] || null;
    }

    public dictify(): any {
        throw 5;
    }
}
