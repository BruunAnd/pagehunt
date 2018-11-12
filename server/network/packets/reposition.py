from server.network.packets import PacketType
from server.network.packets.packet import Packet


class RepositionPacket(Packet):
    def __init__(self, entity):
        self.entity = entity

    def dictify(self):
        return dict(type=self.get_type(), id=self.entity.id, x=self.entity.x, y=self.entity.y)

    def get_type(self):
        return PacketType.Reposition
