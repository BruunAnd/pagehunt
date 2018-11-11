import asyncio
import json
import struct

import websockets

from server.sockets.packets.entity_moved import EntityMovedPacket
from server.sockets.packets.packet import Packet


class SocketsServer:
    def __init__(self):
        self.clients = set()
        self.loop = asyncio.get_event_loop()

    def listen(self, host='', port=4000):
        ws_server = websockets.serve(self.connected, host, port)

        self.loop.run_until_complete(ws_server)
        self.loop.run_forever()

    async def handle_messages(self, client):
        while True:
            message = json.loads(await client.recv())

            # broadcast: await asyncio.wait([client.send(message) for client in self.clients])

    async def send_packet(self, client, packet: Packet):
        await client.send(json.dumps(packet.dictify()))

    async def connected(self, client: websockets.WebSocketServerProtocol, path):
        self.clients.add(client)
        print(f'Connection from {client.remote_address}')

        try:
            await self.send_packet(client, EntityMovedPacket(59.666667, 2.0))
            await self.handle_messages(client)
        except websockets.ConnectionClosed:
            await self.disconnect(client)

    async def disconnect(self, client):
        await client.close()
        self.clients.remove(client)
