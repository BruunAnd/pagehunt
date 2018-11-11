import asyncio
import json
import struct

import websockets

from server.sockets.packets import PacketType
from server.sockets.packets.entity_moved import EntityMovedPacket
from server.sockets.packets.handshake import HandshakePacket
from server.sockets.packets.movement import MovementPacket
from server.sockets.packets.packet import Packet


class SocketsServer:
    def __init__(self, packet_callback):
        self.clients = set()
        self.loop = asyncio.get_event_loop()
        self.packet_callback = packet_callback

    def listen(self, host='', port=4000):
        ws_server = websockets.serve(self.connected, host, port)

        self.loop.run_until_complete(ws_server)
        self.loop.run_forever()

    async def broadcast_packet(self, packet, exclude_clients=None):
        serialized = json.dumps(packet.dictify())

        # Exclude clients if specified
        clients = self.clients
        if exclude_clients:
            clients = {client for client in clients if client not in exclude_clients}

        if not clients:
            # Cannot call wait on an empty list, so we need to return in this case
            return

        await asyncio.wait([client.send(serialized) for client in clients])

    async def handle_messages(self, client):
        while True:
            packet = self.construct_packet(json.loads(await client.recv()))

            await self.packet_callback(client, packet)

    async def send_packet(self, client, packet: Packet):
        await client.send(json.dumps(packet.dictify()))

    async def connected(self, client: websockets.WebSocketServerProtocol, path):
        self.clients.add(client)
        print(f'Connection from {client.remote_address}')

        try:
            await self.handle_messages(client)
        except websockets.ConnectionClosed:
            await self.disconnect(client)

    async def disconnect(self, client):
        await client.close()
        self.clients.remove(client)

    def construct_packet(self, data):
        # Highly readable switch using a dictionary
        return {PacketType.Handshake: HandshakePacket,
                PacketType.Reposition: MovementPacket}[data['type']](data)
