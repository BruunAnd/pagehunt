from server.game.entities import EntityType
from server.game.entities.abilities.ability_base import Ability


class Light(Ability):
    def __init__(self, world, x, y):
        super().__init__(world, EntityType.Light, x, y)
        self.light = 100

    def get_network_entity(self):
        values = super().get_network_entity()
        values['light'] = self.light
        return values

    def activate(self, player):
        player.light += self.light
