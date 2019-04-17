from abc import ABC, abstractmethod


class Packet(ABC):
    @abstractmethod
    def dictify(self):
        pass

    @abstractmethod
    def get_type(self):
        pass
