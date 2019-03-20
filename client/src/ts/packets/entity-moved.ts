import Packet, {PacketType} from './packet';

export default class EntityMovedPacket extends Packet {
    public x: number;
    public y: number;

    constructor(packetDict: any) {
        super(PacketType.EntityMoved);

        this.x = packetDict['x'];
        this.y = packetDict['y'];
    }

    public dictify(): string {
        throw 42;
    }
}
