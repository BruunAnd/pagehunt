from server.game.entities import EntityType
from server.game.entities.moving_entity import MovingEntity


class Slender(MovingEntity):
    def __init__(self, world, initial_x, initial_y):
        super().__init__(world, EntityType.Slender, initial_x, initial_y, 20, "Slender")
