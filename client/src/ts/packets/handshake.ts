import Packet, {PacketType} from './packet';

export class HandshakePacket extends Packet {
    private type = PacketType.Handshake;

    constructor(private name: string) {
        super();
    }

    public dictify(): any {
        return {'type': this.type, 'name': this.name};
    }

    public getType(): PacketType {
        return PacketType.Handshake;
    }
}
