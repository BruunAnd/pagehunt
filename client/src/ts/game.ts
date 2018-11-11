import Player from "./player";
import Input from "./input";
import Map from "./map";
import Vector2 from "./vector2";
import NetworkClient from './network';
import Packet from "./packets/packet";
import {HandshakePacket} from "./packets/handshake";
import MapEntity from "./mapentity";
import MovementController from "./movement";

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
    lastTickTime: any = Date.now();
    tickInterval: any;
    enableInput: boolean = false;
    networkClient: NetworkClient;
    movementController: MovementController;
    
    constructor(canvasId: string, playerName: string) {
        this.canvas = <HTMLCanvasElement>document.getElementById(canvasId);
        this.drawContext = this.canvas.getContext('2d');
        this.tickInterval = setInterval(() => this.gameLoop(), 16);
        this.initNetworkClient();
        this.player = this.buildPlayer(playerName);
        this.map = this.buildMap();
        this.movementController = new MovementController(this.player);
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        document.addEventListener('keydown', function (event) {
            Input.addKey(event.key);
        });
        document.addEventListener('keyup', function (event) {
            Input.removeKey(event.key);
        });
        
        let self = this;
        window.addEventListener('resize', function (event) {
            console.log("Window resized");
            self.canvas.width = window.innerWidth;
            self.canvas.height = window.innerHeight;
        })


        this.enableInput = true;
    }

    private initNetworkClient(): void {
        this.networkClient = new NetworkClient('localhost:4000',
            (packet: Packet) => this.packetReceived(packet));
    }

    private buildMap(): Map {
        //Receive map from server
        return new Map(new Vector2(2000, 2000), [this.player, new MapEntity(2, "Ent2", new Vector2(100, 50))]);
    }

    private buildPlayer(name: string): Player {
        return new Player(name);
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
    }

    private checkMovement(dt: number) {
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

        let moveSpeed: number = 10;
        this.movementController.moveInDirection(dir, moveSpeed * dt);
    }

    public packetReceived(packet: Packet): void {
        console.log(packet);

        this.networkClient.sendPacket(new HandshakePacket('Anders'));
    }

    public draw(): void {
        this.drawContext.fillStyle = '#000000';
        this.drawContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (let ent of this.map.getMapEntities()) {
            ent.draw(this.drawContext);
        }
    }

    public kill(): void {
        console.log('Kill');
        clearInterval(this.tickInterval);
    }
}

