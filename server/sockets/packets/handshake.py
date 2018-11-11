from server.sockets.packets import PacketType
from server.sockets.packets.packet import Packet


class HandshakePacket(Packet):
    def __init__(self, data):
        self.name = data['name']

    def dictify(self):
        pass

    def get_type(self):
        return PacketType.Handshake
