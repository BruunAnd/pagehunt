import Packet, {PacketType} from './packets/packet';
import { EntityMovedPacket } from './packets/entitymoved';

export default class NetworkClient {
    private socket: WebSocket;
    private readonly packetCallback: (Packet) => void;

    constructor(address: string, packetCallback: (Packet) => void) {
        this.packetCallback = packetCallback;

        this.socket = new WebSocket(`ws://${address}`);
        this.socket.onopen = () => this.onOpen();
        this.socket.onmessage = (event) => this.onMessage(event);
        this.socket.onclose = () => this.onClose();
        this.socket.onerror = (event) => this.onError(event);
    }

    public sendPacket(packet: Packet): void {
        this.socket.send(JSON.stringify(packet.dictify()));
    }

    private onError(event): any {
        console.log(`Error: ${event}`);
    }

    private constructPacket(packetDict: any): Packet {
        const type: PacketType = packetDict['type'];

        switch (type) {
            case PacketType.EntityMoved:
                return new EntityMovedPacket(packetDict);
        }

        return null;
    }

    private onMessage(event): any {
        this.packetCallback(this.constructPacket(JSON.parse(event.data)));
    }

    private onOpen(): any {
        console.log('Connection opened');
    }

    private onClose(): any {
        console.log('Connection closed');
    }
}