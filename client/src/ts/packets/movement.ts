import Packet, {PacketType} from "./packet";

export class MovementPacket extends Packet {
    constructor(private direction: any) {
        super();
    }

    public dictify(): any {
        return {'type': this.getType(), 'direction': this.direction};
    }

    public getType(): PacketType {
        return PacketType.Movement;
    }
}