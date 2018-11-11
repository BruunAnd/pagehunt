export default abstract class Packet {
    public abstract dictify(): string;
    public abstract getType(): PacketType;
}

export enum PacketType {
    Handshake,
    EntityMoved,
    SpawnEntity
}