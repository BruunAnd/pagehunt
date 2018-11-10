import asyncore

from server.tcp.tcp_client import ClientHandler
from server.tcp.tcp_server import TCPServer


class GameServer:
    def __init__(self):
        self.tcp_server = TCPServer(4000, self.client_connected)
        self.tcp_clients = []

    def start(self):
        self.tcp_server.start()

        asyncore.loop()

    def broadcast(self, data):
        for client in self.tcp_clients:
            client.send(data)

    def client_connected(self, socket):
        handler = ClientHandler(socket)
        handler.add_read_callback(lambda client, data: self.broadcast(data))
        self.tcp_clients.append(handler)


