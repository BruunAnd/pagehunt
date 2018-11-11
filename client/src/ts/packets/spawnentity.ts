import Packet, {PacketType} from './packet';

export class SpawnEntityPacket extends Packet {
    public x = 0.0;
    public y = 0.0;
    public id = 0;
    public isSelf: boolean;
    public name: string;

    constructor(packetDict: any) {
        super();

        this.x = packetDict['x'];
        this.y = packetDict['y'];
        this.id = packetDict['id'];
        this.isSelf = packetDict['isSelf'];

        if ('name' in packetDict) {
            this.name = packetDict['name'];
        }
    }

    public dictify(): string {
        throw 5;
    }

    public getType(): PacketType {
        return PacketType.SpawnEntity;
    }
}