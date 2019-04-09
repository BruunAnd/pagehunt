from server.network.packets import PacketType
from server.network.packets.packet_base import Packet


class SpawnEntityPacket(Packet):
    def __init__(self, entity, local_player):
        self.entity = entity
        self.local_player = local_player

    def dictify(self):
        return dict(type=self.get_type(), entity=self.entity.get_network_entity(self.local_player))

    def get_type(self):
        return PacketType.SpawnEntity
