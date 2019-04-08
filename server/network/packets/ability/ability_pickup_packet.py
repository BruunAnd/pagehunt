from server.game.entities import EntityType
from server.game.entities.abilities.light import Light
from server.network.packets import PacketType
from server.network.packets.packet_base import Packet


class AbilityPickupPacket(Packet):
    def __init__(self, ability):
        self.ability = ability

        if isinstance(ability, Light):
            self.light = ability.light

    def dictify(self):
        values = dict(type=PacketType.AbilityPickup, ability=self.ability.type)

        if self.light:
            values['light'] = self.ability.light
            return values

    def get_type(self):
        return PacketType.AbilityPickup
