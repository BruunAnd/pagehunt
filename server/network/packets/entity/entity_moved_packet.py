from server.network.packets import PacketType
from server.network.packets.packet_base import Packet


class EntityMovedPacket(Packet):
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def dictify(self):
        return dict(type=PacketType.EntityMoved, x=self.x, y=self.y)

    def get_type(self):
        return PacketType.EntityMoved
