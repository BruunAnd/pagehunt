from server.network.packets import PacketType
from server.network.packets.packet_base import Packet


class RemoveEntityPacket(Packet):
    def __init__(self, entity):
        self.entity = entity

    def dictify(self):
        return dict(type=self.get_type(), id=self.entity.id)

    def get_type(self):
        return PacketType.RemoveEntity
