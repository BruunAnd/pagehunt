import asyncio
import struct

import websockets


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
            message = await client.recv()
            unpacked = struct.unpack('<B', message)

            print(f'Received message {client.remote_address}, {unpacked[0]}')

            await asyncio.wait([client.send(message) for client in self.clients])

    async def send_packet(self, client, packet):
        data = bytearray()
        data.append(123)

        await client.send(bytes(data))

    async def connected(self, client: websockets.WebSocketServerProtocol, path):
        self.clients.add(client)
        print(f'Connection from {client.remote_address}')

        try:
            await self.send_packet(client, None)
            await self.handle_messages(client)
        except websockets.ConnectionClosed:
            await self.disconnect(client)

    async def disconnect(self, client):
        await client.close()
        self.clients.remove(client)
