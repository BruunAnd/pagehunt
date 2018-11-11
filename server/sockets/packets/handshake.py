from server.sockets.packets.packet import Packet


class HandshakePacket(Packet):
    def __init__(self, data):
        print(f"Welcome, {data['name']}")

    def dictify(self):
        pass
