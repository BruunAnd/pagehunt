import math


class Entity:
    def __init__(self, id, initial_x, initial_y):
        self.id = id
        self.x = initial_x
        self.y = initial_y

    def move_in_direction(self, direction):
        distance = 10

        self.x = self.x + distance * math.cos(direction * math.pi / 180)
        self.y = self.y + distance * math.sin(direction * math.pi / 180)
