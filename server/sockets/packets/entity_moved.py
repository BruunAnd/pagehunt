from server.sockets.packets import PacketType
from server.sockets.packets.packet import Packet


class EntityMovedPacket(Packet):
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def dictify(self):
        return dict(type=PacketType.EntityMoved, x=self.x, y=self.y)
