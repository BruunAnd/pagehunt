import Packet, {PacketType} from './packet';

export default class RemoveEntityPacket extends Packet {
    public id: number;

    constructor(packetDict: any) {
        super();

        this.id = packetDict['id'];
    }

    public dictify(): any {
        throw 5;
    }

    public getType(): PacketType {
        return PacketType.RemoveEntity;
    }
}
