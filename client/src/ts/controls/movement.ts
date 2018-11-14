import { Direction } from "../entities/player";
import Vector2D from "../vector2d";

export default class MovementController {
    public static getNewLocation(currentPos: Vector2D, angle: number, distance: number): Vector2D {
        return this.calculateNewPosition(currentPos, angle, distance)
    }

    public static getDegreesFromDirection(direction: Direction): number {
        if (direction != Direction.None) {
            switch (direction) {
                case 1:
                    //Up
                    return -90;
                case 2:
                    //Down
                    return 90;
                case 4:
                    //Left
                    return -180;
                case 5:
                    //Up & Left
                    return -135;
                case 6:
                    //Down & Left
                    return -225;
                case 8:
                    //Right
                    return 0;
                case 9:
                    //Up & Right
                    return -45;
                case 10:
                    //Down & Right
                    return 45;
                default:
                    return -1;
            }
        }
    }

    private static calculateNewPosition(currentPos: Vector2D, degrees: number, distance: number): Vector2D {
        return new Vector2D(currentPos.x + distance * Math.cos(degrees * Math.PI / 180), currentPos.y + distance * Math.sin(degrees * Math.PI / 180));
    }
}