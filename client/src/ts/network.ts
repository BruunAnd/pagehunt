import Packet, { PacketType } from './packets/packet';
import { EntityMovedPacket } from './packets/entity-moved';
import { SpawnEntityPacket } from './packets/spawn-entity';
import { RepositionPacket } from './packets/reposition';
import {RemoveEntityPacket} from "./packets/remove-entity";

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

    private onError(event): void {
        console.log(`Error: ${event}`);
    }

    private constructPacket(data: any): Packet {
        const type: PacketType = data['type'];

        switch (type) {
            case PacketType.EntityMoved:
                return new EntityMovedPacket(data);
            case PacketType.SpawnEntity:
                return new SpawnEntityPacket(data);
            case PacketType.Reposition:
                return new RepositionPacket(data);
            case PacketType.RemoveEntity:
                return new RemoveEntityPacket(data);
        }

        return null;
    }

    private onMessage(event): void {
        this.packetCallback(this.constructPacket(JSON.parse(event.data)));
    }

    private onOpen(): void {
        this.connectedCallback();
    }

    private onClose(): void {
        console.log('Connection closed');
    }
}