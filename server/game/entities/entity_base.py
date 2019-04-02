class Entity:
    def __init__(self, world, type, solid, initial_x, initial_y, name=None):
        self.id = world.next_entity_id
        self.name = name
        self.world = world
        self.type = type
        self.solid = solid
        self.x = initial_x
        self.y = initial_y
        self.width = 32
        self.height = 32

    def occupies_location(self, x, y):
        a = min(self.x + self.width, x + self.width) - max(self.x, x)
        b = min(self.y + self.height, y + self.height) - max(self.y, y)
        return (a >= 0) and (b >= 0)

    def location_blocked(self, x, y):
        blocked = False
        for ent in self.world.get_world_entities():
            if ent.id == self.id:
                continue

            if ent.occupies_location(x, y):
                if ent.solid:
                    blocked = True
                break

        return blocked
