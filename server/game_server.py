from server.game.packet_handler import PacketHandler
from server.network.packets.entity.remove_entity_packet import RemoveEntityPacket
from server.network.sockets_server import SocketsServer


class GameServer:
    def __init__(self):
        self.entities = set()
        self.entity_count = 0
        self.client_player_map = dict()

        # Initialize network stuff
        self.sockets_server = SocketsServer()
        self.packet_handler = PacketHandler(self, self.sockets_server)

        # Event subscriptions
        self.sockets_server.packet_event += self.packet_handler.packet_received
        self.sockets_server.player_disconnected_event += self.player_disconnected

    @property
    def next_entity_id(self):
        self.entity_count += 1

        return self.entity_count

    def start(self):
        self.sockets_server.listen()

    async def player_disconnected(self, client):
        if client not in self.client_player_map:
            return

        player = self.client_player_map[client]

        # Remove player from entities and client from dict
        self.entities.remove(player)
        del self.client_player_map[client]

        # Broadcast entity removal
        await self.sockets_server.broadcast_packet(RemoveEntityPacket(player))
