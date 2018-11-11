import Packet, {PacketType} from './packet';

export class HandshakePacket extends Packet {
    private type = PacketType.Handshake;

    dictify(): any {
        return {'type': this.type};
    }
}
