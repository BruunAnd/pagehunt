export default abstract class Packet {
    public abstract dictify(): string;
}

export enum PacketType {
    Handshake,
    EntityMoved
}