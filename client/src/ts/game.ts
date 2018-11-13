import Player from "./player";
import Input from "./input";
import Map from "./map";
import Vector2 from "./vector2";
import NetworkClient from './network';
import Packet, {PacketType} from "./packets/packet";
import {HandshakePacket} from "./packets/handshake";
import {SpawnEntityPacket} from "./packets/spawn-entity";
import MovementController from "./movement";
import MapEntity, {EntityType} from "./map-entity";
import { MovementPacket } from "./packets/movement";
import { RepositionPacket } from "./packets/reposition";
import Camera from "./camera";
import {RemoveEntityPacket} from "./packets/remove-entity";

export enum Direction {
    None = 0,
    Up = 1 << 0,    // 0001 -- the bitshift is unnecessary, but done for consistency
    Down = 1 << 1,  // 0010
    Left = 1 << 2,  // 0100
    Right = 1 << 3, // 1000
}

export class Game {
    canvas: HTMLCanvasElement;
    player: Player;
    map: Map;
    drawContext: CanvasRenderingContext2D;
    lastTickTime: number = Date.now();
    tickInterval: number;
    enableInput: boolean = false;
    networkClient: NetworkClient;
    camera: Camera;
    
    constructor(canvasId: string) {
        this.canvas = <HTMLCanvasElement>document.getElementById(canvasId);
        this.drawContext = this.canvas.getContext('2d');
        this.initNetworkClient();
        this.map = this.buildMap();//TODO: Get map from server
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.camera = new Camera(new Vector2(0, 0), this.canvas);

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
        this.tickInterval = setInterval(() => this.gameLoop(), 16);
        this.enableInput = true;
    }

    private initNetworkClient(): void {
        this.networkClient = new NetworkClient('localhost:4000',
            (packet: Packet) => this.packetReceived(packet), () => this.onConnected());
    }

    private buildMap(): Map {
        //Receive map from server
        return new Map(new Vector2(2000, 2000));
    }

    private buildPlayer(id: number, name: string, pos?: Vector2): Player {
        if (pos) {
            return new Player(id, name, pos);
        }
        else {
            return new Player(id, name);
        }
    }
    
    private gameLoop(): void {
        let tickTime = Date.now();
        let dt = ((Date.now() - this.lastTickTime) / 1000) * 20;
        this.lastTickTime = tickTime;
        this.tick(dt);
        this.draw();
    }

    private tick(dt: number): void {
        if (this.enableInput) {
            this.checkMovement(dt);
        }

        this.camera.tick();
    }

    private checkMovement(dt: number): void {
        let dir: Direction = Direction.None;

        if (Input.getKey("w")) {
            dir = Direction.Up;
        }
        if (Input.getKey("s")) {
            if (dir == Direction.None) {
                dir = Direction.Down;
            }
            else {
                dir = dir | Direction.Down;
            }
        }
        if (Input.getKey("a")) {
            if (dir == Direction.None) {
                dir = Direction.Left;
            }
            else {
                dir = dir | Direction.Left;
            }
        }
        if (Input.getKey("d")) {
            if (dir == Direction.None) {
                dir = Direction.Right;
            }
            else {
                dir = dir | Direction.Right;
            }
        }

        if (dir != Direction.None) {
            const moveSpeed = 10;
            const angle = MovementController.getDegreesFromDirection(dir);

            if (angle != -1) {
                this.sendMovement(angle);
                this.player.move(MovementController.getNewLocation(this.player.pos, angle, moveSpeed * dt), this.map);
                this.camera.setPosition(this.player.pos);
            }
        }
    }

    private sendMovement(direction: number): void {
        this.networkClient.sendPacket(new MovementPacket(direction));
    }

    private handleSpawnEntity(packet: SpawnEntityPacket): void {
        const position = new Vector2(packet.x, packet.y);

        if (packet.isSelf) {
            this.player = this.buildPlayer(packet.id, packet.name, position);
            this.map.addMapEntities([this.player]);
            this.camera.setPosition(this.player.pos);
        } else {
            const entity = new MapEntity(packet.id, EntityType.NetworkPlayer, packet.name, position);
            this.map.addMapEntities([entity]);
        }
    }

    private handleReposition(packet: RepositionPacket): void {
        this.map.getMapEntities().forEach(function (element: MapEntity) {
            if (element.id === packet.id) {
                element.pos = new Vector2(packet.x, packet.y);
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

    public draw(): void {
        this.drawContext.fillStyle = '#000000';
        this.drawContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (let ent of this.map.getMapEntities()) {
            ent.draw(this.drawContext, this.camera.getPosition());
        }
    }

    public kill(): void {
        console.log('Kill');
        clearInterval(this.tickInterval);
    }
}

