import Vector2D from "../vector2d";
import { Game } from "../game";

export enum EntityType {
    LocalPlayer = "LPlayer",
    NetworkPlayer = "NPlayer",
    Slender = "Slender",
    Page = "Page",
    Light = "Light",
    Tree = "Tree"
}

export default class MapEntity {
    private picture: HTMLImageElement = null;
    readonly game;
    readonly id: number;
    readonly name: string;
    readonly type: EntityType;
    readonly width: number = 32;
    readonly height: number = 32;
    protected render;
    public pos: Vector2D = new Vector2D(0, 0);
    public renderID: number;

    constructor(game: Game, id: number, type: EntityType, name?: string, pos?: Vector2D) {
        this.game = game;
        this.id = id;

        if (type == EntityType.LocalPlayer || type == EntityType.NetworkPlayer) {
            if (name) {
                this.name = name;
            }
            else{
                this.name = "Unknown Player";
            }
        }
        else if (type == EntityType.Slender) {
            this.name = "Slenderman";
        }
        else {
            if (name) {
                this.name = name;
            }
            else {
                this.name = type;
            }
        }

        let image = new Image();
        image.addEventListener('load', () => {
            this.picture = image;
        });
        image.src = "/client/graphics/" + type + ".png";
        
        if (pos) {
            this.pos = pos;
        }

        this.render = () => {
            this.game.drawContext.beginPath();
            this.game.drawContext.fillStyle = '#FF0000';
            this.game.drawContext.fillRect(this.pos.x - this.game.camera.getPosition().x, this.pos.y - this.game.camera.getPosition().y, this.width, this.height);
            this.game.drawContext.fillStyle = '#FFFFFF';
            this.game.drawContext.fillText(this.name, this.pos.x - this.game.camera.getPosition().x, (this.pos.y - 8) - this.game.camera.getPosition().y);
            this.game.drawContext.stroke();
            this.game.drawContext.closePath();

            this.renderID = requestAnimationFrame(this.render);
        };
        requestAnimationFrame(this.render);

        console.log(`Spawned entity '${name}:${this.id}' at position 'x:${this.pos.x}, y:${this.pos.y}'`);
    }

    public occupiesPosition(position: Vector2D): boolean {
        const a = Math.min(this.pos.x + this.width, position.x + this.width) - Math.max(this.pos.x, position.x);
        const b = Math.min(this.pos.y + this.height, position.y + this.height) - Math.max(this.pos.y, position.y);
        return (a >= 0) && (b >= 0);

    }
}