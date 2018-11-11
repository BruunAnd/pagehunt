import Packet, {PacketType} from "./packet";

export class RepositionPacket extends Packet {
    public x: number;
    public y: number;
    public id: number;

    constructor(packetDict: any) {
        super();

        this.x = packetDict['x'];
        this.y = packetDict['y'];
        this.id = packetDict['id'];
    }

    public dictify(): any {
        throw 5;
    }

    public getType(): PacketType {
        return PacketType.Reposition;
    }
}