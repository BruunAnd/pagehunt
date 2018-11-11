export default abstract class Packet {
    public abstract dictify(): any;
    public abstract getType(): PacketType;
}

export enum PacketType {
    Handshake,
    EntityMoved,
    SpawnEntity,
    Movement,
    Reposition
}