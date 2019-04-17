from server.game.entities import NetworkEntityType
from server.game.entities.player import Player
from server.network.packets import PacketType
from server.network.packets.handshake_packet import HandshakePacket
from server.network.packets.entity.movement_packet import MovementPacket
from server.network.packets.world.spawn_entity_packet import SpawnEntityPacket
from server.network.packets.world.world_transfer_packet import TransferWorldPacket


class PacketHandler:
    def __init__(self, game, sockets_server):
        self.game = game
        self.sockets_server = sockets_server

    async def handle_movement(self, client, packet: MovementPacket):
        player = self.game.client_player_map[client]
        await player.move(self.sockets_server, client, packet.x, packet.y)
        await player.pickup(self.sockets_server, client, packet.x, packet.y)

    async def handle_handshake(self, client, packet: HandshakePacket):
        # Initialize player
        x, y = self.game.world.next_spawn_point
        player = Player(self.game.world, packet.name, x, y)

        # Send world to this player
        await self.sockets_server.send_packet(client, TransferWorldPacket(self.game.world))

        # Add to client->player map
        self.game.client_player_map[client] = player

        # Add to world
        self.game.world.add_world_entity(player)

        # Send spawn message to player
        spawn_packet = SpawnEntityPacket(player, True)
        await self.sockets_server.send_packet(client, spawn_packet)

        # Broadcast spawn message to other players
        spawn_packet.local_player = False
        await self.sockets_server.broadcast_packet(spawn_packet, exclude_clients={client})

    async def packet_received(self, client, packet):
        handlers = {PacketType.Handshake: self.handle_handshake,
                    PacketType.Movement: self.handle_movement}

        await handlers[packet.get_type()](client, packet)
