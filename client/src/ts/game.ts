import Player from "./entities/player";
import Input from "./input";
import GameMap from "./game-map";
import Vector2D from "./vector2d";
import MapEntity, {EntityType} from "./entities/map-entity";
import NetworkClient from './network';
import SpawnEntityPacket from "./packets/spawn-entity";
import RepositionPacket from "./packets/reposition";
import RemoveEntityPacket from "./packets/remove-entity";
import Camera from "./camera";
import Renderer from "./renderer";

export class Game {
    tickrate: number = 40;
    player: Player;
    map: GameMap;
    lastTickTime: number = Date.now();
    tickInterval: number;
    enableInput: boolean = false;
    networkClient: NetworkClient;
    camera: Camera;
    renderer: Renderer;
    
    constructor(canvasId: string) {
        this.networkClient = new NetworkClient(this, 'localhost:4000');
        this.renderer = new Renderer(this, canvasId);
        this.map = this.buildMap(); // TODO: Get map from server
        this.camera = new Camera(new Vector2D(0, 0), this.renderer.canvas.get('world'));

        document.addEventListener('keydown', (event) => {
            Input.addKey(event.key);
        });
        document.addEventListener('keyup', (event) => {
            Input.removeKey(event.key);
        });
        window.addEventListener('resize', () => {
            this.renderer.onResize(window.innerWidth, window.innerHeight);
            this.camera.onResize(this.renderer.canvas.get('world'));
            this.camera.setPosition(this.player.pos);
        });

        //Start the game loop
        this.tickInterval = setInterval(() => this.tick(), 1000/this.tickrate);
        this.enableInput = true;
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

    public handleSpawnEntity(packet: SpawnEntityPacket): void {
        const position = new Vector2D(packet.x, packet.y);

        if (packet.isSelf) {
            this.player = this.buildPlayer(packet.id, packet.name, position);
            this.map.addEntity(this.player);
            this.camera.setPosition(this.player.pos);
        } else {
            const entity = new MapEntity(this, packet.id, packet.entity, packet.name, position);
            this.map.addEntity(entity);
        }
    }

    public handleReposition(packet: RepositionPacket): void {
        this.map.getEntities().forEach(function (ent: MapEntity) {
            if (ent.id === packet.id) {
                ent.pos = new Vector2D(packet.x, packet.y);
            }
        });
    }

    public handleRemoveEntity(packet: RemoveEntityPacket) {
        console.log(`Player ${packet.id} disconnected!`);
        this.map.removeEntity(packet.id);
    }
}

