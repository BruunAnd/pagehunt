from server.game.entity import Entity


class Player(Entity):
    def __init__(self, player_id, name, initial_x, initial_y):
        super().__init__(player_id, initial_x, initial_y)

        self.name = name
