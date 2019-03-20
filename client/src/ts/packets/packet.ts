export default abstract class Packet {
    abstract dictify(): any;
    readonly packetType: PacketType;

    constructor(packetType: PacketType) {
        this.packetType = packetType;
    }

}

export enum PacketType {
    Handshake,
    EntityMoved,
    SpawnEntity,
    Movement,
    Reposition,
    RemoveEntity
}
