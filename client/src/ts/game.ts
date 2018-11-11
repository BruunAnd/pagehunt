import Player from "./player";
import Input from "./input";
import Map from "./map";
import Vector2 from "./vector2";
import MapEntity from "./mapentity";
import NetworkClient from './network';
import Packet from "./packets/packet";

enum Direction {
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
    
    constructor(canvasId: string, playerName: string) {
        this.canvas = <HTMLCanvasElement>document.getElementById(canvasId);
        this.drawContext = this.canvas.getContext('2d');
        this.tickInterval = setInterval(() => this.gameLoop(), 50);
        this.player = this.buildPlayer(playerName);
        this.map = this.buildMap();
        this.networkClient = new NetworkClient('localhost:4000', this.packetReceived);
        
        document.addEventListener('keydown', function (event) {
            Input.addKey(event.key);
        });
        document.addEventListener('keyup', function (event) {
            Input.removeKey(event.key);
        });
        this.enableInput = true;
    }

    private buildMap(): Map {
        //Recieve map from server
        return new Map(new Vector2(20, 20), [this.player]);
    }

    private buildPlayer(name: string): Player {
        //Register player on server

        //Recieve player id from server
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
        let dir: Direction = Direction.None;

        if (this.enableInput) {
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
                let moveSpeed = 10;
                switch (dir) {
                    case 1:
                        //Up
                        this.player.move(0, moveSpeed * dt);
                    case 2:
                        //Down
                        this.player.move(180, moveSpeed * dt);
                    case 4:
                        //Left
                        this.player.move(270, moveSpeed * dt);
                    case 5:
                        //Up & Left
                        this.player.move(315, moveSpeed * dt);
                    case 6:
                        //Down & Left
                        this.player.move(225, moveSpeed * dt);
                    case 8:
                        //Right
                        this.player.move(90, moveSpeed * dt);
                    case 9:
                        //Up & Right
                        this.player.move(45, moveSpeed * dt);
                    case 10:
                        //Down & Right
                        this.player.move(135, moveSpeed * dt);
                    default:
                    //Invalid combination
                }
            }
        }
    }

    public packetReceived(packet: Packet): void {
        console.log(packet);
    }

    public draw(): void {
        this.drawContext.fillStyle = '#FF0000';
        this.drawContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let ent of this.map.getMapEntities()) {
            ent.draw(this.drawContext);
        }
    }

    public kill(): void {
        console.log('Kill');
        clearInterval(this.tickInterval);
    }
}

