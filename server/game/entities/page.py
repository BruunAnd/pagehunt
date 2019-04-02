from server.game.entities import EntityType
from server.game.entities.entity_base import Entity


class Page(Entity):
    def __init__(self, world, x, y):
        super().__init__(world, EntityType.Page, False, x, y)
