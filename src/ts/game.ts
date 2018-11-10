import { Player } from "./player";

export class Game {
    canvas: HTMLCanvasElement;
    drawContext: CanvasRenderingContext2D;

    constructor(canvasId: string) {
        this.canvas = <HTMLCanvasElement> document.getElementById(canvasId);
        this.drawContext = this.canvas.getContext('2d');
    }

    public draw(): void {
        this.drawContext.fillStyle = '#FF0000';
        this.drawContext.fillRect(0,0,150,75);
    }
}
