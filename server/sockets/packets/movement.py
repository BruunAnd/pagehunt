from server.sockets.packets import PacketType
from server.sockets.packets.packet import Packet


class MovementPacket(Packet):
    def __init__(self, data):
        self.direction = data['direction']

    def dictify(self):
        pass

    def get_type(self):
        return PacketType.MovementPacket
