from server.game.entities.entity_base import Entity
from abc import ABC, abstractmethod


class Ability(Entity, ABC):
    def __init__(self, world, ability_type, x, y):
        super().__init__(world, ability_type, False, x, y)

    @abstractmethod
    def activate(self, *args):
        pass
