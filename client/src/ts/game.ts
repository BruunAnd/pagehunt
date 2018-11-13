import Player from "./player";
import Input from "./input";
import GameMap from "./game-map";
import Vector2 from "./vector2";
import NetworkClient from './network';
import Packet, {PacketType} from "./packets/packet";
import { HandshakePacket } from "./packets/handshake";
import { SpawnEntityPacket } from "./packets/spawn-entity";
import MapEntity, { EntityType } from "./map-entity";
import { RepositionPacket } from "./packets/reposition";
import Camera from "./camera";
import { RemoveEntityPacket } from "./packets/remove-entity";

export class Game {
    canvas: HTMLCanvasElement;
    player: Player;
    map: GameMap;
    drawContext: CanvasRenderingContext2D;
    lastTickTime: number = Date.now();
    tickInterval: number;
    enableInput: boolean = false;
    networkClient: NetworkClient;
    camera: Camera;
    render;
    
    constructor(canvasId: string) {
        this.canvas = <HTMLCanvasElement>document.getElementById(canvasId);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.drawContext = this.canvas.getContext('2d');
        this.camera = new Camera(new Vector2(0, 0), this.canvas);
        this.initNetworkClient();
        this.map = this.buildMap();//TODO: Get map from server

        document.addEventListener('keydown', (event) => {
            Input.addKey(event.key);
        });
        document.addEventListener('keyup', (event) => {
            Input.removeKey(event.key);
        });
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.camera.onResize(this.canvas);
            this.camera.setPosition(this.player.pos);
        });

        //Start the game loop
        this.tickInterval = setInterval(() => this.tick(), 16);
        this.enableInput = true;
        this.render = () => {
            this.drawContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.drawContext.fillStyle = '#000000';
            this.drawContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

            requestAnimationFrame(this.render);
        };

        this.render();
    }

    private initNetworkClient(): void {
        this.networkClient = new NetworkClient('localhost:4000',
            (packet: Packet) => this.packetReceived(packet), () => this.onConnected());
    }

    private buildMap(): GameMap {
        //Receive map from server
        return new GameMap(new Vector2(2000, 2000));
    }

    private buildPlayer(id: number, name: string, pos?: Vector2): Player {
        if (pos) {
            return new Player(this, id, name, pos);
        }
        else {
            return new Player(this, id, name);
        }
    }

    private tick(): void {
        let tickTime = Date.now();
        let dt = ((Date.now() - this.lastTickTime) / 1000) * 20;
        this.lastTickTime = tickTime;

        if (this.player)
            this.player.tick(dt);
        if (this.camera)
            this.camera.tick(dt);
    }

    private handleSpawnEntity(packet: SpawnEntityPacket): void {
        const position = new Vector2(packet.x, packet.y);

        if (packet.isSelf) {
            this.player = this.buildPlayer(packet.id, packet.name, position);
            this.map.addMapEntities([this.player]);
            this.camera.setPosition(this.player.pos);
        } else {
            const entity = new MapEntity(this, packet.id, EntityType.NetworkPlayer, packet.name, position);
            this.map.addMapEntities([entity]);
        }
    }

    private handleReposition(packet: RepositionPacket): void {
        this.map.getMapEntities().forEach(function (ent: MapEntity) {
            if (ent.id === packet.id) {
                ent.pos = new Vector2(packet.x, packet.y);
            }
        });
    }

    private handleRemoveEntity(packet: RemoveEntityPacket) {
        this.map.removeMapEntityByID(packet.id);
    }

    public packetReceived(packet: Packet): void {
        switch (packet.getType()) {
            case PacketType.SpawnEntity: return this.handleSpawnEntity(<SpawnEntityPacket> packet);
            case PacketType.Reposition: return this.handleReposition(<RepositionPacket> packet);
            case PacketType.RemoveEntity: return this.handleRemoveEntity(<RemoveEntityPacket> packet);
        }
    }

    public onConnected(): void {
        this.networkClient.sendPacket(new HandshakePacket('Anders'));
    }
}

