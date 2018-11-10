import asyncore


class ClientHandler(asyncore.dispatcher_with_send):
    def __init__(self, socket):
        super().__init__(socket)

        self.read_callbacks = []

    def add_read_callback(self, callback):
        self.read_callbacks.append(callback)

    def handle_read(self):
        data = self.recv(8192)

        if data:
            for callback in self.read_callbacks:
                callback(self, data)
