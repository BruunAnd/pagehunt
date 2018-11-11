import math


class Entity:
    def __init__(self, id, initialX, initialY):
        self.id = id
        self.x = initialX
        self.y = initialY

    def move_in_direction(self, direction):
        distance = 10

        self.x = self.x + distance * math.cos(direction * math.pi / 180)
        self.y = self.y + distance * math.sin(direction * math.pi / 180)
