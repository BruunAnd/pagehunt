import Packet from "./packet";

export default class NetworkClient {
    private socket: WebSocket;

    constructor(address: string) {
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
        this.socket.binaryType = 'arraybuffer';
    }

    private onError(event): any {
        console.log(`Error: ${event}`);
    }

    private constructPacket(rawPacket: Uint8Array): Packet {
        return null;
    }

    private onMessage(event): any {
        const rawPacket = new Uint8Array(event.data);
        console.log(rawPacket[0]);

        const reply = new Uint8Array(1);
        reply[0] = 250;
        this.socket.send(reply);
    }

    private onOpen(): any {
        console.log('Connection opened');
    }

    private onClose(): any {
        console.log('Connection closed');
    }
}