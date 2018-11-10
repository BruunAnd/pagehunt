import asyncore
import socket


class TCPServer(asyncore.dispatcher):
    def __init__(self, port, incoming_callback):
        super().__init__()

        self.port = port
        self.callback = incoming_callback

    def start(self):
        self.create_socket(socket.AF_INET, socket.SOCK_STREAM)
        self.set_reuse_addr()
        self.bind(('', self.port))
        self.listen(5)

        print(f'Listening on {self.addr}')

    def handle_accept(self):
        pair = self.accept()

        if pair:
            sock, addr = pair

            self.callback(sock)
