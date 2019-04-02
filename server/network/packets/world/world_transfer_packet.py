from server.network.packets import PacketType
from server.network.packets.packet_base import Packet


class TransferWorldPacket(Packet):
    def __init__(self, world):
        self.world = world

    def dictify(self):
        values = dict(type=self.get_type(), world=self.world.get_network_world())
        return values

    def get_type(self):
        return PacketType.WorldTransfer
