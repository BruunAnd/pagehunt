import random

from server.game.player import Player
from server.network.packets import PacketType
from server.network.packets.handshake import HandshakePacket
from server.network.packets.movement import MovementPacket
from server.network.packets.reposition import RepositionPacket
from server.network.packets.spawn_entity import SpawnEntityPacket
from server.network.sockets_server import SocketsServer


class GameServer:
    def __init__(self):
        self.entities = set()
        self.entity_count = 0
        self.client_player_map = dict()
        self.sockets_server = SocketsServer(self.packet_received)

    def get_next_id(self):
        self.entity_count += 1

        return self.entity_count

    async def handle_movement(self, client, packet: MovementPacket):
        player = self.client_player_map[client]
        player.move_in_direction(packet.direction)

        # Broadcast movement packet
        movement = RepositionPacket(player)
        await self.sockets_server.broadcast_packet(movement)

    async def handle_handshake(self, client, packet: HandshakePacket):
        # Initialize player
        x, y = random.uniform(0, 300), random.uniform(0, 300)
        player = Player(self.get_next_id(), packet.name, x, y)

        # Send existing entities to this player
        for existing in self.entities:
            await self.sockets_server.send_packet(client, SpawnEntityPacket(False, existing))

        # Add to client->player map
        self.client_player_map[client] = player

        # Add to set of entities
        self.entities.add(player)

        # Send spawn message to player
        spawn_packet = SpawnEntityPacket(True, player)
        await self.sockets_server.send_packet(client, spawn_packet)

        # Broadcast spawn message to other players
        spawn_packet.is_self = False
        await self.sockets_server.broadcast_packet(spawn_packet, exclude_clients={client})

    async def packet_received(self, client, packet):
        handlers = {PacketType.Handshake: self.handle_handshake,
                    PacketType.Movement: self.handle_movement}

        await handlers[packet.get_type()](client, packet)

    def start(self):
        self.sockets_server.listen()

