from server.sockets.sockets_server import SocketsServer


class GameServer:
    def __init__(self):
        self.sockets_server = SocketsServer()

    def start(self):
        self.sockets_server.listen()

