import Packet, {PacketType} from './packets/packet';
import {HandshakePacket} from "./packets/handshake";
import {EntityMovedPacket} from "./packets/entitymoved";

export default class NetworkClient {
    private socket: WebSocket;
    private packetCallback: any;

    constructor(address: string, packetCallback) {
        this.packetCallback = packetCallback;
        const _this = this;

        this.socket = new WebSocket(`ws://${address}`);
        this.socket.onopen = function() {
          return _this.onOpen();
        };
        this.socket.onmessage = function (event) {
          return _this.onMessage(event);
        };
        this.socket.onclose = function() {
          return _this.onClose();
        };
        this.socket.onerror =  function (event) {
          return _this.onError(event);
        };
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