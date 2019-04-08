from server.game.entities import EntityType, NetworkEntityType
from server.game.entities.moving_entity import MovingEntity
from server.network.packets.ability.ability_pickup_packet import AbilityPickupPacket
from server.network.packets.world.remove_entity_packet import RemoveEntityPacket


class Player(MovingEntity):
    def __init__(self, world, name, initial_x, initial_y):
        super().__init__(world, EntityType.Player, initial_x, initial_y, 10, name)

        self.light = 300

    def get_network_entity(self, local_player=False):
        values = super().get_network_entity()
        values['light'] = self.light

        if local_player:
            values['type'] = NetworkEntityType.LocalPlayer
        else:
            values['type'] = NetworkEntityType.NetworkPlayer

        return values

    async def pickup(self, server, client, x, y):
        for ability in self.world.ability_entities:
            if ability.occupies_location(x, y):
                self.world.remove_map_entity(ability)
                await server.broadcast_packet(RemoveEntityPacket(ability))
                await server.send_packet(client, AbilityPickupPacket(ability))
                ability.activate(player=self)
