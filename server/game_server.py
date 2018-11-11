from server.sockets.sockets_server import SocketsServer


class GameServer:
    def __init__(self):
        self.sockets_server = SocketsServer(self.packet_received)

    def packet_received(self, client, packet):
        pass

    def start(self):
        self.sockets_server.listen()

