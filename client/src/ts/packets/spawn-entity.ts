import Packet, {PacketType} from './packet';
import {EntityType} from "../entities/entity";

export default class SpawnEntityPacket extends Packet {
    public x: number;
    public y: number;
    public id: number;
    public entity: EntityType;
    public isSelf: boolean;
    public name: string;

    constructor(packetDict: any) {
        super(PacketType.SpawnEntity);

        this.x = packetDict['x'];
        this.y = packetDict['y'];
        this.id = packetDict['id'];
        this.entity = packetDict['entity'];

        if ('name' in packetDict) {
            this.name = packetDict['name'];
        }
    }

    public dictify(): any {
        throw 5;
    }
}