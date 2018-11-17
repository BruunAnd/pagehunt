import Player from "./entities/player";
import Input from "./input";
import GameMap from "./game-map";
import Vector2D from "./vector2d";
import NetworkClient from './network';
import Packet, {PacketType} from "./packets/packet";
import { HandshakePacket } from "./packets/handshake";
import { SpawnEntityPacket } from "./packets/spawn-entity";
import MapEntity, { EntityType } from "./entities/map-entity";
import { RepositionPacket } from "./packets/reposition";
import Camera from "./camera";
import { RemoveEntityPacket } from "./packets/remove-entity";
import Util from "./util";

export class Game {
    tickrate: number = 40;
    canvas: Map<string, HTMLCanvasElement> = new Map<string, HTMLCanvasElement>();
    ctx: Map<String, CanvasRenderingContext2D> = new Map<String, CanvasRenderingContext2D>();
    player: Player;
    map: GameMap;
    lastTickTime: number = Date.now();
    tickInterval: number;
    enableInput: boolean = false;
    networkClient: NetworkClient;
    camera: Camera;
    render;
    
    constructor(canvasId: string) {
        const worldCanvas = <HTMLCanvasElement>document.getElementById(canvasId);
        worldCanvas.width = window.innerWidth;
        worldCanvas.height = window.innerHeight;
        this.canvas.set('world', worldCanvas);
        this.ctx.set('world', worldCanvas.getContext('2d'));
        const fogCanvas = document.createElement('canvas');
        fogCanvas.width = worldCanvas.width;
        fogCanvas.height = worldCanvas.height;
        this.canvas.set('fog', fogCanvas);
        this.ctx.set('fog', fogCanvas.getContext('2d'));
        const entityCanvas = document.createElement('canvas');
        entityCanvas.width = worldCanvas.width;
        entityCanvas.height = worldCanvas.height;
        this.canvas.set('entity', entityCanvas);
        this.ctx.set('entity', entityCanvas.getContext('2d'));
        this.camera = new Camera(new Vector2D(0, 0), worldCanvas);
        this.initNetworkClient();
        this.map = this.buildMap(); // TODO: Get map from server

        document.addEventListener('keydown', (event) => {
            Input.addKey(event.key);
        });
        document.addEventListener('keyup', (event) => {
            Input.removeKey(event.key);
        });
        window.addEventListener('resize', () => {
            this.canvas.forEach((value: HTMLCanvasElement) => {
                value.width = window.innerWidth;
                value.height = window.innerHeight;
            });

            this.camera.onResize(this.canvas.get('world'));
            this.camera.setPosition(this.player.pos);
        });

        //Start the game loop
        this.tickInterval = setInterval(() => this.tick(), 1000/this.tickrate);
        this.enableInput = true;
        this.render = () => {
            if (!this.player) {
                requestAnimationFrame(this.render);
                return;
            }
            this.ctx.get('world').clearRect(0, 0, this.canvas.get('world').width, this.canvas.get('world').height);

            // (Re)draw fog of war
            this.ctx.get('fog').fillStyle = '#000000';
            this.ctx.get('fog').fillRect(0, 0, this.canvas.get('fog').width, this.canvas.get('fog').height);

            const x = (this.player.pos.x + this.player.width / 2) - this.camera.getPosition().x;
            const y = (this.player.pos.y + this.player.height / 2) - this.camera.getPosition().y;
            const lightMin = this.player.light - 10;
            const lightMax = this.player.light + 10;

            // Remove the fog of war in circle based on the light value
            this.ctx.get('fog').beginPath();
            let radGrd: CanvasGradient;
                if (this.player.hasLigth) {
                    radGrd = this.ctx.get('world').createRadialGradient( x, y, 20, x, y, Util.getRandomRange(lightMin, lightMax));
                    radGrd.addColorStop( 0, 'rgba( 0, 0, 0,  1 )' );
                    radGrd.addColorStop( this.player.lightDensity, 'rgba( 0, 0, 0, .6 )' );
                    radGrd.addColorStop( 1, 'rgba( 0, 0, 0,  0 )' );
                    document.body.style.background = '#6a6a05';
                } else {
                    radGrd = this.ctx.get('world').createRadialGradient( x, y, 20, x, y, this.player.light);
                    radGrd.addColorStop( 0, 'rgba( 0, 0, 0, .4 )' );
                    radGrd.addColorStop( .7, 'rgba( 0, 0, 0, .1 )' );
                    radGrd.addColorStop( 1, 'rgba( 0, 0, 0, 0 )' );
                    document.body.style.background = '#554444';
                }

                this.ctx.get('fog').globalCompositeOperation = 'xor';
                this.ctx.get('fog').fillStyle = radGrd;
                this.ctx.get('fog').arc(x, y, lightMax,0,Math.PI*2,true);
                this.ctx.get('fog').fill();

                this.ctx.get('fog').globalCompositeOperation = 'source-over';
            this.ctx.get('fog').closePath();

            this.map.getEntities().forEach((ent: MapEntity) => {
                // Don't draw stuff that is not near us
                if (ent.pos.distance(this.player.pos) > this.player.light + 100) {
                    return;
                }

                ent.render();
            });

            this.ctx.get('world').drawImage(this.canvas.get('fog'), 0, 0);
            requestAnimationFrame(this.render);
        };
        requestAnimationFrame(this.render);
    }

    private initNetworkClient(): void {
        this.networkClient = new NetworkClient('localhost:4000',
            (packet: Packet) => this.packetReceived(packet), () => this.onConnected());
    }

    private buildMap(): GameMap {
        //Receive map from server
        return new GameMap(new Vector2D(2000, 2000));
    }

    private buildPlayer(id: number, name: string, pos?: Vector2D): Player {
        if (pos) {
            return new Player(this, id, name, pos);
        } else {
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
        const position = new Vector2D(packet.x, packet.y);

        if (packet.isSelf) {
            this.player = this.buildPlayer(packet.id, packet.name, position);
            this.map.addEntity([this.player]);
            this.camera.setPosition(this.player.pos);
        } else {
            const entity = new MapEntity(this, packet.id, EntityType.NetworkPlayer, packet.name, position);
            this.map.addEntity([entity]);
        }
    }

    private handleReposition(packet: RepositionPacket): void {
        this.map.getEntities().forEach(function (ent: MapEntity) {
            if (ent.id === packet.id) {
                ent.pos = new Vector2D(packet.x, packet.y);
            }
        });
    }

    private handleRemoveEntity(packet: RemoveEntityPacket) {
        console.log(`Player ${packet.id} disconnected!`);
        this.map.removeEntity(packet.id);
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

