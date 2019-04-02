from queue import Queue


class World:
    def __init__(self, world_size, num_players):
        self.world_size = world_size
        self.num_players = num_players
        self._world_spawns = Queue()
        self._world_entities = list()
        self.current_entity_id = 0

    @property
    def next_entity_id(self):
        self.current_entity_id += 1

        return self.current_entity_id

    @property
    def next_spawn_point(self):
        return self._world_spawns.get()

    @property
    def num_spawn_points(self):
        return self._world_spawns.qsize()

    def add_world_entity(self, entity):
        self._world_entities.append(entity)

    def add_multiple_world_entities(self, entities):
        for entity in entities:
            self.add_world_entity(entity)

    def add_spawn_point(self, spawn_point):
        self._world_spawns.put(spawn_point)

    def add_multiple_spawn_points(self, spawn_points):
        for spawn_point in spawn_points:
            self.add_spawn_point(spawn_point)

    def remove_map_entity(self, entity):
        self._world_entities.remove(entity)

    def remove_map_entity_by_id(self, entity_id):
        self.remove_map_entity(self.get_entity_by_id(entity_id))

    def get_world_entities(self):
        return self._world_entities

    def get_entity_by_id(self, entity_id):
        for entity in self._world_entities:
            if entity.id == entity_id:
                return entity

    def get_network_world(self):
        entities = list()
        for entity in self._world_entities:
            if not entity.name:
                entities.append(dict(id=entity.id, type=entity.type, x=entity.x, y=entity.y, width=entity.width, height=entity.height))
            else:
                entities.append(dict(id=entity.id, type=entity.type, name=entity.name, x=entity.x, y=entity.y, width=entity.width, height=entity.height))
        return dict(size=self.world_size, entities=entities)
