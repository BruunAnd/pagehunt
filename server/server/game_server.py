from server.game.packet_handler import PacketHandler
from server.network.packets.world.remove_entity_packet import RemoveEntityPacket
from server.network.sockets_server import SocketsServer
from server.game.world_generator import WorldGenerator


class GameServer:
    def __init__(self):
        self.world = WorldGenerator.generate_world(1000, 10)
        self.client_player_map = dict()

        # Initialize network stuff
        self.sockets_server = SocketsServer()
        self.packet_handler = PacketHandler(self, self.sockets_server)

        # Event subscriptions
        self.sockets_server.packet_event += self.packet_handler.packet_received
        self.sockets_server.player_disconnected_event += self.player_disconnected

    def start(self):
        self.sockets_server.listen()

    async def player_disconnected(self, client):
        if client not in self.client_player_map:
            return

        player = self.client_player_map[client]

        # Remove player from world and client from dict
        self.world.remove_map_entity(player)
        del self.client_player_map[client]

        # Broadcast entity removal
        await self.sockets_server.broadcast_packet(RemoveEntityPacket(player))
