import Packet, {PacketType} from './packet';

export class HandshakePacket extends Packet {
    constructor(private name: string) {
        super();
    }

    public dictify(): any {
        return {'type': this.getType(), 'name': this.name};
    }

    public getType(): PacketType {
        return PacketType.Handshake;
    }
}
