from enum import IntEnum


class PacketType(IntEnum):
    Handshake = 0,
    EntityMoved = 1,
    SpawnEntity = 2
