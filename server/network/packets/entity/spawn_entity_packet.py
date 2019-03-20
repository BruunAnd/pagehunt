from server.game.player import Player
from server.network.packets import PacketType
from server.network.packets.packet_base import Packet


class SpawnEntityPacket(Packet):
    def __init__(self, entity_type, entity):
        self.entity_type = entity_type
        self.entity = entity

        if isinstance(self.entity, Player):
            self.name = self.entity.name

    def dictify(self):
        values = dict(type=self.get_type(), id=self.entity.id, entity=self.entity_type, x=self.entity.x,
                      y=self.entity.y)

        if self.name:
            values['name'] = self.name

        return values

    def get_type(self):
        return PacketType.SpawnEntity
