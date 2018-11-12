import random

from server.game.player import Player
from server.network.packets import PacketType
from server.network.packets.handshake_packet import HandshakePacket
from server.network.packets.entity.movement_packet import MovementPacket
from server.network.packets.entity.reposition_packet import RepositionPacket
from server.network.packets.entity.spawn_entity_packet import SpawnEntityPacket


class PacketHandler:
    def __init__(self, game, sockets_server):
        self.game = game
        self.sockets_server = sockets_server

    async def handle_movement(self, client, packet: MovementPacket):
        player = self.game.client_player_map[client]
        player.move_in_direction(packet.direction)

        # Broadcast movement packet
        movement = RepositionPacket(player)
        await self.sockets_server.broadcast_packet(movement)

    async def handle_handshake(self, client, packet: HandshakePacket):
        # Initialize player
        x, y = random.uniform(0, 300), random.uniform(0, 300)
        player = Player(self.game.next_entity_id, packet.name, x, y)

        # Send existing entities to this player
        for existing in self.game.entities:
            await self.sockets_server.send_packet(client, SpawnEntityPacket(False, existing))

        # Add to client->player map
        self.game.client_player_map[client] = player

        # Add to set of entities
        self.game.entities.add(player)

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
