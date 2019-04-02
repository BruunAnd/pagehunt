from server.game.entities import EntityType
from server.game.entities.entity_base import Entity


class Tree(Entity):
    def __init__(self, world, x, y):
        super().__init__(world, EntityType.Tree, x, y)
