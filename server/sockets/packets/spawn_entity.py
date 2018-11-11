from server.game.player import Player
from server.sockets.packets import PacketType
from server.sockets.packets.packet import Packet


class SpawnEntityPacket(Packet):
    def __init__(self, id: int, is_self: bool, entity):
        self.id = id
        self.is_self = is_self
        self.entity = entity

        if isinstance(self.entity, Player):
            self.name = self.entity.name

    def dictify(self):
        values = dict(type=PacketType.SpawnEntity, id=self.id, isSelf=self.is_self, x=self.entity.x, y=self.entity.y)
        if self.name:
            values['name'] = self.name

        return values

    def get_type(self):
        return PacketType.SpawnEntity
