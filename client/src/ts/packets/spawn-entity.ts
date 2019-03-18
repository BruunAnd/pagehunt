import Packet, {PacketType} from './packet';
import {EntityType} from "../entities/map-entity";

export default class SpawnEntityPacket extends Packet {
    public x: number;
    public y: number;
    public id: number;
    public entity: EntityType;
    public isSelf: boolean;
    public name: string;

    constructor(packetDict: any) {
        super();

        this.x = packetDict['x'];
        this.y = packetDict['y'];
        this.id = packetDict['id'];
        this.entity = packetDict['entity'];
        this.isSelf = packetDict['isSelf'];

        if ('name' in packetDict) {
            this.name = packetDict['name'];
        }
    }

    public dictify(): any {
        throw 5;
    }

    public getType(): PacketType {
        return PacketType.SpawnEntity;
    }
}