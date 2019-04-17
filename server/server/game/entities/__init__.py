from enum import IntEnum


class EntityType(IntEnum):
    Player = 10,
    Slender = 11,
    Page = 12,
    Light = 13,
    Fireball = 14,
    Tree = 15


class NetworkEntityType(IntEnum):
    LocalPlayer = 20,
    NetworkPlayer = 21
