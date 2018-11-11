import Packet, {PacketType} from './packet';

export class HandshakePacket extends Packet {
    private type = PacketType.Handshake;

    public dictify(): any {
        return {'type': this.type};
    }
}
