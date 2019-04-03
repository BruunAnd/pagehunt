from server.game.entities.entity_base import Entity
from server.network.packets.entity.reposition_packet import RepositionPacket


class MovingEntity(Entity):
    def __init__(self, world, type, initial_x, initial_y, move_speed):
        super().__init__(world, type, True, initial_x, initial_y)
        self.moveSpeed = move_speed

    def confirm_movement(self, x, y):
        if not self.can_move(x, y):
            print(f"{self.id} attempted to move to {(x, y)} from {(self.x,self.y)} illegally!")
            return False

        if self.crossed_map_boundary(x, y):
            print(f"{self.id} attempted to move outside the map!")

        if self.location_blocked(x, y):
            print(f"{self.id} attempted to move to {(x, y)}, but the location was blocked!")
            return False

        return True

    def can_move(self, x, y):
        return x <= self.x + self.moveSpeed and y <= self.y + self.moveSpeed

    def crossed_map_boundary(self, x, y):
        return x < 0 or y < 0 or x > self.world.world_size or y > self.world.world_size

    async def move(self, server, client, x, y):
        if self.confirm_movement(x, y):
            # If movement is legit, broadcast the movement to everyone else
            # Otherwise send the current location to tell the client to return
            self.x = x
            self.y = y
            await server.broadcast_packet(RepositionPacket(self), exclude_clients={client})

        await server.send_packet(client, RepositionPacket(self))
