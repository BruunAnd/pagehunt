import Packet, {PacketType} from './packet';

export default class RemoveEntityPacket extends Packet {
    public id: number;

    constructor(packetDict: any) {
        super(PacketType.RemoveEntity);

        this.id = packetDict['id'];
    }

    public dictify(): any {
        throw 5;
    }
}
