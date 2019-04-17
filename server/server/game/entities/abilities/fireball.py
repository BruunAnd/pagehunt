from server.game.entities import EntityType
from server.game.entities.abilities.ability_base import Ability


class Fireball(Ability):
    def __init__(self, world, x, y):
        super().__init__(world, EntityType.Fireball, x, y)

    def activate(self):
        pass
