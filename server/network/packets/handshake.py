from server.network.packets import PacketType
from server.network.packets.packet import Packet


class HandshakePacket(Packet):
    def __init__(self, data):
        self.name = data['name']

    def dictify(self):
        pass

    def get_type(self):
        return PacketType.Handshake
