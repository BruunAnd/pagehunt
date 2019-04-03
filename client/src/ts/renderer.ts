import Util from "./util";
import Entity, {EntityType} from "./entities/entity";
import {Game} from "./game";

export default class Renderer {
    canvas: HTMLCanvasElement;
    game: Game;

    constructor(game: Game, canvasId: string) {
        this.game = game;
        this.canvas = <HTMLCanvasElement>document.getElementById(canvasId);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        requestAnimationFrame(() => this.render());
    }

    public onResize(newWidth: number, newHeight: number) {
        this.canvas.width = newWidth;
        this.canvas.height = newHeight;
    }

    private fog_canvas(): HTMLCanvasElement {
        const fog: HTMLCanvasElement = document.createElement('canvas');
        fog.width = this.canvas.width;
        fog.height = this.canvas.height;
        const fogCtx = fog.getContext('2d');
        fogCtx.fillStyle = '#000000';
        fogCtx.fillRect(0, 0, fog.width, fog.height);

        const x = (this.game.player.getPosition().x + this.game.player.transform.width / 2) - this.game.camera.getPosition().x;
        const y = (this.game.player.getPosition().y + this.game.player.transform.height / 2) - this.game.camera.getPosition().y;
        const lightMin = this.game.player.light - 10;
        const lightMax = this.game.player.light + 10;

        // Remove the fog of war in circle based on the light value
        let radGrd: CanvasGradient;
        if (this.game.player.hasLigth) {
            radGrd = fogCtx.createRadialGradient(x, y, 20, x, y, Util.getRandomRange(lightMin, lightMax));
            radGrd.addColorStop(0, 'rgba( 0, 0, 0,  1 )');
            radGrd.addColorStop(this.game.player.lightDensity, 'rgba( 0, 0, 0, .6 )');
            radGrd.addColorStop(1, 'rgba( 0, 0, 0,  0 )');
            document.body.style.background = '#6a6a05';
        } else {
            radGrd = fogCtx.createRadialGradient(x, y, 20, x, y, this.game.player.light);
            radGrd.addColorStop(0, 'rgba( 0, 0, 0, .4 )');
            radGrd.addColorStop(.7, 'rgba( 0, 0, 0, .1 )');
            radGrd.addColorStop(1, 'rgba( 0, 0, 0, 0 )');
            document.body.style.background = '#554444';
        }

        fogCtx.globalCompositeOperation = 'xor';
        fogCtx.fillStyle = radGrd;
        fogCtx.arc(x, y, lightMax, 0, Math.PI * 2, true);
        fogCtx.fill();

        return fog;
    }

    private render() {
        if (!this.game.camera) {
            requestAnimationFrame(() => this.render());
            console.log("No camera found!");
            return;
        }
        if (!this.game.world) {
            requestAnimationFrame(() => this.render());
            console.log("No world found!");
            return;
        }
        if (!this.game.player) {
            requestAnimationFrame(() => this.render());
            console.log("No player found!");
            return;
        }
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let i: number;
        for (i = 0; i < 3; i++) {
            this.game.world.getEntitiesOnLayer(i).forEach((ent: Entity) => {
                // Don't draw stuff that is not near us
                if (ent.getPosition().distance(this.game.player.getPosition()) > this.game.player.light + 100) {
                    return;
            }// This will be server side eventually

            const x = ent.getPosition().x - this.game.camera.getPosition().x;
            const y = ent.getPosition().y - this.game.camera.getPosition().y;
            ctx.beginPath();
                switch (ent.type) {
                    case EntityType.Tree:
                        ctx.fillStyle = '#006400';
                        break;
                    case EntityType.LocalPlayer:
                        ctx.fillStyle = '#ffff00';
                        break;
                    case EntityType.Slender:
                        ctx.fillStyle = '#000000';
                        break;
                    default:
                        ctx.fillStyle = '#AA0000';
                        break;
                }
                ctx.fillRect(x, y, ent.transform.width, ent.transform.height);
                ctx.fillStyle = '#FFFFFF';
                ctx.fillText(ent.name, x, y - 5);
            ctx.closePath();
            });
        }

        ctx.drawImage(this.fog_canvas(), 0, 0);
        requestAnimationFrame(() => this.render());
    }
}