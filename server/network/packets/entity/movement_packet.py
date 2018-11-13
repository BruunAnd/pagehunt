from server.network.packets import PacketType
from server.network.packets.packet_base import Packet


class MovementPacket(Packet):
    def __init__(self, data):
        if 'x' not in data or 'y' not in data:
            print(data)
        self.x = data['x']
        self.y = data['y']

    def dictify(self):
        pass

    def get_type(self):
        return PacketType.Movement
