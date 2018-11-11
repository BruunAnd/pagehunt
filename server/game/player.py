from server.game.entity import Entity


class Player(Entity):
    def __init__(self, playerId, name, initialX, initialY):
        super().__init__(playerId, initialX, initialY)

        self.name = name