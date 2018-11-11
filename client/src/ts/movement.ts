import { Direction } from "./game";
import Player from "./player";

export default class MovementController {
    player: Player;
    
    constructor(player: Player) {
        this.player = player
    }

    public moveInDirection(direction: Direction, distance: number) {
        if (direction != Direction.None) {
            switch (direction) {
                case 1:
                    //Up
                    this.player.move(-90, distance);
                    break;
                case 2:
                    //Down
                    this.player.move(90, distance);
                    break;
                case 4:
                    //Left
                    this.player.move(-180, distance);
                    break;
                case 5:
                    //Up & Left
                    this.player.move(-135, distance);
                    break;
                case 6:
                    //Down & Left
                    this.player.move(-225, distance);
                    break;
                case 8:
                    //Right
                    this.player.move(0, distance);
                    break;
                case 9:
                    //Up & Right
                    this.player.move(-45, distance);
                    break;
                case 10:
                    //Down & Right
                    this.player.move(45, distance);
                    break;
                default:
                //Invalid combination
            }
        }
    }
}