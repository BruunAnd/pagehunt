import Util from "./util";
import MapEntity, {EntityType} from "./entities/map-entity";
import {Game} from "./game";

export default class Renderer {
    canvas: Map<string, HTMLCanvasElement> = new Map<string, HTMLCanvasElement>();
    ctx: Map<String, CanvasRenderingContext2D> = new Map<String, CanvasRenderingContext2D>();
    game: Game;

    constructor(game: Game, canvasId: string) {
        this.game = game;
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

        requestAnimationFrame(() => this.render());
    }

    public onResize(newWidth: number, newHeight: number) {
        this.canvas.forEach((value: HTMLCanvasElement) => {
            value.width = newWidth;
            value.height = newHeight;
        });
    }

    private render() {
        if (!this.game.camera) {
            requestAnimationFrame(() => this.render());
            return;
        }
        if (!this.game.map) {
            requestAnimationFrame(() => this.render());
            return;
        }
        if (!this.game.player) {
            requestAnimationFrame(() => this.render());
            return;
        }
        this.ctx.get('world').clearRect(0, 0, this.canvas.get('world').width, this.canvas.get('world').height);

        // (Re)draw fog of war
        this.ctx.get('fog').fillStyle = '#000000';
        this.ctx.get('fog').fillRect(0, 0, this.canvas.get('fog').width, this.canvas.get('fog').height);

        const x = (this.game.player.pos.x + this.game.player.width / 2) - this.game.camera.getPosition().x;
        const y = (this.game.player.pos.y + this.game.player.height / 2) - this.game.camera.getPosition().y;
        const lightMin = this.game.player.light - 10;
        const lightMax = this.game.player.light + 10;

        // Remove the fog of war in circle based on the light value
        this.ctx.get('fog').beginPath();
        let radGrd: CanvasGradient;
        if (this.game.player.hasLigth) {
            radGrd = this.ctx.get('world').createRadialGradient(x, y, 20, x, y, Util.getRandomRange(lightMin, lightMax));
            radGrd.addColorStop(0, 'rgba( 0, 0, 0,  1 )');
            radGrd.addColorStop(this.game.player.lightDensity, 'rgba( 0, 0, 0, .6 )');
            radGrd.addColorStop(1, 'rgba( 0, 0, 0,  0 )');
            document.body.style.background = '#6a6a05';
        } else {
            radGrd = this.ctx.get('world').createRadialGradient(x, y, 20, x, y, this.game.player.light);
            radGrd.addColorStop(0, 'rgba( 0, 0, 0, .4 )');
            radGrd.addColorStop(.7, 'rgba( 0, 0, 0, .1 )');
            radGrd.addColorStop(1, 'rgba( 0, 0, 0, 0 )');
            document.body.style.background = '#554444';
        }

        this.ctx.get('fog').globalCompositeOperation = 'xor';
        this.ctx.get('fog').fillStyle = radGrd;
        this.ctx.get('fog').arc(x, y, lightMax, 0, Math.PI * 2, true);
        this.ctx.get('fog').fill();

        this.ctx.get('fog').globalCompositeOperation = 'source-over';
        this.ctx.get('fog').closePath();

        this.game.map.getEntities().forEach((ent: MapEntity) => {
            // Don't draw stuff that is not near us
            if (ent.pos.distance(this.game.player.pos) > this.game.player.light + 100) {
                return;
            }// This will be server side eventually

            const x = ent.pos.x - this.game.camera.getPosition().x;
            const y = ent.pos.y - this.game.camera.getPosition().y;
            this.ctx.get('world').beginPath();
                switch (ent.type) {
                case EntityType.LocalPlayer:
                    this.ctx.get('world').fillStyle = '#00AA00';
                    break;
                default:
                    this.ctx.get('world').fillStyle = '#AA0000';
                    break;
                }
                this.ctx.get('world').fillRect(x, y, ent.width, ent.height);
                this.ctx.get('world').fillStyle = '#FFFFFF';
                this.ctx.get('world').fillText(ent.name, x, y - 5);
            this.ctx.get('world').closePath();
        });

        this.ctx.get('world').drawImage(this.canvas.get('fog'), 0, 0);
        requestAnimationFrame(() => this.render());
    }
}