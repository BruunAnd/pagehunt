import Util from "./util";
import Entity, {EntityType} from "./entities/entity";
import {Game} from "./game";
import {WorldLayer} from "./world";
import LuminousEntity from "./entities/luminous-entity";

class LightSpot {
    x: number;
    y: number;
    radius: number;
    gradient: CanvasGradient;

    constructor(x: number, y: number, radius: number, gradient: CanvasGradient) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.gradient = gradient;
    }
}

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

    private light_area(ent: LuminousEntity): LightSpot {
        const x = (ent.getPosition().x + ent.transform.width / 2) - this.game.camera.getPosition().x;
        const y = (ent.getPosition().y + ent.transform.height / 2) - this.game.camera.getPosition().y;

        const lightMin = ent.light - 10;
        const lightMax = ent.light + 10;

        let radGrd: CanvasGradient;
        if (ent.hasLight()) {
            radGrd = this.canvas.getContext('2d').createRadialGradient(x, y, 20, x, y, Util.getRandomRange(lightMin, lightMax));
            radGrd.addColorStop(0, 'rgba( 0, 0, 0,  1 )');
            radGrd.addColorStop(ent.lightDensity, 'rgba( 0, 0, 0, .6 )');
            radGrd.addColorStop(1, 'rgba( 0, 0, 0,  0 )');
        } else {
            radGrd = this.canvas.getContext('2d').createRadialGradient(x, y, 20, x, y, ent.light);
            radGrd.addColorStop(0, 'rgba( 0, 0, 0, .4 )');
            radGrd.addColorStop(.7, 'rgba( 0, 0, 0, .1 )');
            radGrd.addColorStop(1, 'rgba( 0, 0, 0, 0 )');
        }

        return new LightSpot(x, y, lightMax, radGrd);
    }

    private fog_canvas(): HTMLCanvasElement {
        const fog: HTMLCanvasElement = document.createElement('canvas');
        fog.width = this.canvas.width;
        fog.height = this.canvas.height;
        const fogCtx = fog.getContext('2d');
        fogCtx.fillStyle = '#000000';
        fogCtx.fillRect(0, 0, fog.width, fog.height);

        this.game.world.getLuminousEntities().forEach((ent: LuminousEntity) => {
            if (ent !== this.game.player && !ent.hasLight())
                return;

            const lightArea = this.light_area(ent);

            fogCtx.globalCompositeOperation = 'xor';
            fogCtx.fillStyle = lightArea.gradient;
            fogCtx.arc(lightArea.x, lightArea.y, lightArea.radius, 0, Math.PI * 2, true);
            fogCtx.fill();
        });

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

        this.game.world.getLuminousEntities().forEach((ent: LuminousEntity) => {
            ctx.beginPath();
                if (ent.hasLight())
                    ctx.fillStyle = "#6a6a05";
                else
                    return;

                const x = (ent.getPosition().x + ent.transform.width / 2) - this.game.camera.getPosition().x;
                const y = (ent.getPosition().y + ent.transform.height / 2) - this.game.camera.getPosition().y;

                ctx.arc(x, y, ent.light, 0, Math.PI * 2, true);
                ctx.fill();
            ctx.closePath();
        });

        let i: number;
        for (i = 0; i < Object.keys(WorldLayer).length / 2; i++) {
            this.game.world.getEntitiesOnLayer(i).forEach((ent: Entity) => {
                // Don't draw stuff that is not near us
                if (ent.getPosition().distance(this.game.player.getPosition()) > this.game.player.light + 2) {
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