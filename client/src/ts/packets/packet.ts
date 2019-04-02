export default abstract class Packet {
    abstract dictify(): any;
    readonly packetType: PacketType;

    constructor(packetType: PacketType) {
        this.packetType = packetType;
    }

}

export enum PacketType {
    Handshake = 0,
    EntityMoved = 1,
    SpawnEntity = 2,
    Movement = 3,
    Reposition = 4,
    RemoveEntity = 5,
    WorldTransfer = 6
}
