from server.sockets.packets import PacketType
from server.sockets.packets.packet import Packet


class SpawnEntityPacket(Packet):
    def __init__(self, id: int, is_self: bool, entity):
        self.id = id
        self.is_self = is_self
        self.entity = entity

    def dictify(self):
        return dict(type=PacketType.SpawnEntity, id=self.id, isSelf=self.is_self, x=self.entity.x, y=self.entity.y)

    def get_type(self):
        return PacketType.SpawnEntity
