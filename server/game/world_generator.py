import math
from random import Random
from noise import snoise3

from server.game.entities.tree import Tree
from server.game.world import World


class WorldGenerator:
    @staticmethod
    def generate_world(world_size, player_num, seed=-1):
        # TODO: Define map size based on number of players
        rng = Random()
        if seed is not -1:
            rng.seed(seed)

        adjusted_size = round(world_size / 32) * 32
        world = World(adjusted_size, player_num)

        entities = list()
        spawn_points = list()

        print(f"Corrected world size: {adjusted_size}")

        print("Chunks:")
        x = 0
        i = 1

        while x < adjusted_size - 32:
            y = 0
            while y < adjusted_size - 32:
                noise = abs(snoise3(x / 32, y / 32, rng.randrange(0, 1)))
                print(noise)
                if noise > 0.7:
                    # TODO: Have more variety in world spawning
                    # TODO: Make random spawns smarter
                    entities.append(Tree(world, x, y))
                else:
                    if len(spawn_points) < player_num:
                        for sx, sy in spawn_points:
                            if math.hypot(sx - x, sy - y) < 100:
                                break
                        spawn_points.append((x, y))
                        print(f"Spawn point: {(x, y)}")
                y += 32
                i += 1
            x += 32

        world.add_multiple_spawn_points(spawn_points)
        world.add_multiple_world_entities(entities)
        return world
