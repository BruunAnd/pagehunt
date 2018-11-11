from server.game.player import Player
from server.sockets.packets import PacketType
from server.sockets.packets.handshake import HandshakePacket
from server.sockets.packets.spawn_entity import SpawnEntityPacket
from server.sockets.sockets_server import SocketsServer


class GameServer:
    def __init__(self):
        self.entity_count = 0
        self.client_player_map = dict()
        self.sockets_server = SocketsServer(self.packet_received)

    def get_next_id(self):
        self.entity_count += 1

        return self.entity_count

    async def handle_handshake(self, client, packet: HandshakePacket):
        player = Player(self.get_next_id(), packet.name, 10, 20)

        self.client_player_map[client] = player

        # Send spawn message to player
        spawn_packet = SpawnEntityPacket(True, player)
        await self.sockets_server.send_packet(client, spawn_packet)

        # Broadcast spawn message to other players
        spawn_packet.is_self = False
        # TODO: Broadcast to other players

    async def packet_received(self, client, packet):
        handlers = {PacketType.Handshake: self.handle_handshake}

        await handlers[packet.get_type()](client, packet)

    def start(self):
        self.sockets_server.listen()

