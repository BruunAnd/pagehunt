import Packet, {PacketType} from './packet';

export default class HandshakePacket extends Packet {
    constructor(private name: string) {
        super(PacketType.Handshake);
    }

    public dictify(): any {
        return {'type': this.packetType, 'name': this.name};
    }
}
