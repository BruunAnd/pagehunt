import { NetworkClient } from './network';

export class Game {
    private canvas: HTMLCanvasElement;
    private drawContext: CanvasRenderingContext2D;
    private networkClient: NetworkClient;

    constructor(canvasId: string) {
        this.canvas = <HTMLCanvasElement> document.getElementById(canvasId);
        this.drawContext = this.canvas.getContext('2d');
        this.networkClient = new NetworkClient('localhost:4000');
    }

    public draw(): void {
        this.drawContext.fillStyle = '#FF0000';
        this.drawContext.fillRect(0,0,150,75);
    }
}
