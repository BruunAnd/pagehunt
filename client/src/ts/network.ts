import Packet, {PacketType} from './packets/packet';
import { EntityMovedPacket } from './packets/entitymoved';
import {SpawnEntity, SpawnEntityPacket} from "./packets/spawnentity";

export default class NetworkClient {
    private socket: WebSocket;

    constructor(address: string,
                private packetCallback: (Packet) => void,
                private connectedCallback: () => void) {
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
            case PacketType.SpawnEntity:
                return new SpawnEntityPacket(packetDict);
        }

        return null;
    }

    private onMessage(event): any {
        this.packetCallback(this.constructPacket(JSON.parse(event.data)));
    }

    private onOpen(): any {
        this.connectedCallback();
    }

    private onClose(): any {
        console.log('Connection closed');
    }
}