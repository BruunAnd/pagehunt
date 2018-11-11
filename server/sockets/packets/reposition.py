from server.sockets.packets import PacketType
from server.sockets.packets.packet import Packet


class RepositionPacket(Packet):
    def __init__(self, entity):
        self.entity = entity

    def dictify(self):
        return dict(type=self.get_type(), id=self.entity.id, x=self.entity.x, y=self.entity.y)

    def get_type(self):
        return PacketType.Reposition
