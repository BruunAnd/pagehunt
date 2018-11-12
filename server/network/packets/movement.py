from server.network.packets import PacketType
from server.network.packets.packet import Packet


class MovementPacket(Packet):
    def __init__(self, data):
        if 'direction' not in data:
            print(data)
        self.direction = data['direction']

    def dictify(self):
        pass

    def get_type(self):
        return PacketType.Movement
