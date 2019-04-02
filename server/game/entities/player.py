from server.game.entities import EntityType
from server.game.entities.moving_entity import MovingEntity


class Player(MovingEntity):
    def __init__(self, world, name, initial_x, initial_y):
        super().__init__(world, EntityType.Player, initial_x, initial_y, 30)

        self.name = name
