from server.game.packet_handler import PacketHandler
from server.network.sockets_server import SocketsServer


class GameServer:
    def __init__(self):
        self.entities = set()
        self.entity_count = 0
        self.client_player_map = dict()

        # Initialize network stuff
        self.sockets_server = SocketsServer()
        self.packet_handler = PacketHandler(self, self.sockets_server)
        self.sockets_server.packet_event += self.packet_handler.packet_received

    @property
    def next_entity_id(self):
        self.entity_count += 1

        return self.entity_count

    def start(self):
        self.sockets_server.listen()

