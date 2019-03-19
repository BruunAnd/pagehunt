from server.network.packets.entity.reposition_packet import RepositionPacket
from enum import IntEnum


class EntityType(IntEnum):
    LocalPlayer = 0,
    NetworkPlayer = 1,
    Slender = 2,
    Page = 3,
    Light = 4,
    Tree = 5


class Entity:
    def __init__(self, game, id, type, initial_x, initial_y):
        self.id = id
        self.game = game
        self.type = type
        self.x = initial_x
        self.y = initial_y
        self.width = 32
        self.height = 32
        self.moveSpeed = 10

    def confirm_movement(self, x, y):
        if not self.can_move(x, y):
            print(f"{self.id} attempted to move to ({x}, {y}) from ({self.x}, {self.y}) illegally!")
            return False

        if self.crossed_map_boundary(x, y):
            print(f"{self.id} attempted to move outside the map!")

        if self.location_occupied(x, y):
            print(f"{self.id} attempted to move to ({x}, {y}), but the location was occupied!")
            return False

        return True

    def can_move(self, x, y):
        return x <= self.x + self.moveSpeed and y <= self.y + self.moveSpeed

    def crossed_map_boundary(self, x, y):
        return False  # TODO: Implement when server has map

    def occupies_location(self, x, y):
        a = min(self.x + self.width, x + self.width) - max(self.x, x)
        b = min(self.y + self.height, y + self.height) - max(self.y, y)
        return (a >= 0) and (b >= 0)

    def location_occupied(self, x, y):
        blocked = False
        for ent in self.game.entities:
            if ent.id == self.id:
                continue

            if ent.occupies_location(x, y):
                blocked = True
                break
        return blocked

    async def move(self, server, x, y):
        # Broadcast movement packet
        self.x = x
        self.y = y
        await server.broadcast_packet(RepositionPacket(self))
