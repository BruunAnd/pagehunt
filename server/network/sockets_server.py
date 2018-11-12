import asyncio
import json

import websockets

from server.event_hook import AsyncEventHook
from server.network.packets.packet_base import Packet
from server.network.packets.utility import construct_packet


class SocketsServer:

    def __init__(self):
        self.clients = set()
        self.loop = asyncio.get_event_loop()

        # Initialize event handlers
        self.packet_event = AsyncEventHook()
        self.player_disconnected_event = AsyncEventHook()

    def listen(self, host='', port=4000):
        ws_server = websockets.serve(self.connected, host, port)
        print(f'Listening on {host}:{port}')

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
            packet = construct_packet(json.loads(await client.recv()))

            await self.packet_event.fire(client, packet)

    async def send_packet(self, client, packet: Packet):
        await client.send(json.dumps(packet.dictify()))

    async def connected(self, client: websockets.WebSocketServerProtocol, path):
        self.clients.add(client)

        try:
            await self.handle_messages(client)
        except websockets.ConnectionClosed:
            await self.disconnect(client)

    async def disconnect(self, client):
        self.clients.remove(client)

        await client.close()
        await self.player_disconnected_event.fire(client)
