from server.game.entities.entity_base import Entity


class Ability(Entity):
    def __init__(self, world, ability_type, x, y):
        super().__init__(world, ability_type, x, y)
