from server.network.packets import PacketType
from server.network.packets.handshake_packet import HandshakePacket
from server.network.packets.movement_packet import MovementPacket


def construct_packet(data):
    # Highly readable switch using a dictionary
    return {PacketType.Handshake: HandshakePacket,
            PacketType.Movement: MovementPacket}[data['type']](data)
