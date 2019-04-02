from enum import IntEnum


class PacketType(IntEnum):
    Handshake = 0,
    EntityMoved = 1,
    SpawnEntity = 2,
    Movement = 3,
    Reposition = 4,
    RemoveEntity = 5,
    WorldTransfer = 6
