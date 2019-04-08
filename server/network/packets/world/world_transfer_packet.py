from server.network.packets import PacketType
from server.network.packets.packet_base import Packet


class TransferWorldPacket(Packet):
    def __init__(self, world):
        self.world = world

    def dictify(self):
        return dict(type=self.get_type(), world=self.world.network_world)

    def get_type(self):
        return PacketType.WorldTransfer
