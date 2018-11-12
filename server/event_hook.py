class AsyncEventHook(object):
    def __init__(self):
        self.__handlers = []

    def __iadd__(self, handler):
        self.__handlers.append(handler)
        return self

    def __isub__(self, handler):
        self.__handlers.remove(handler)
        return self

    async def fire(self, *args, **keywargs):
        for handler in self.__handlers:
            await handler(*args, **keywargs)
