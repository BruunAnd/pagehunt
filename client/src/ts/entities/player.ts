import Vector2D from "../vector2d";
import World from "../world";
import Input from "../input";
import MovementController, {Direction} from "../controls/movement";
import Entity, {EntityType} from "./entity";
import Transform from "../transform";

export default class Player extends Entity {
    hasLigth: boolean;
    light: number;
    world: World;
    moveSpeed: number;
    readonly lightDensity: number;
    readonly minLightLevel: number;

    constructor(id: number, sprite: HTMLImageElement, world: World, moveSpeed: number, name?: string, transform?: Transform) {
        super(id, EntityType.LocalPlayer, sprite, name != null ? name : "Unknown Player", 1, transform);
        this.world = world;
        this.hasLigth = true;
        this.light = 300;
        this.lightDensity = .4;
        this.minLightLevel = 200;
        this.moveSpeed = moveSpeed;
    }

    public tick(dt: number): void {
        this.checkMovement(dt);
        if (this.hasLigth) {
            this.light -= .1;
        }
        if (this.light < this.minLightLevel) {
            this.hasLigth = false;
        }
    }

    public move(newPos: Vector2D): Vector2D {
        let correctX: number = newPos.x;
        let correctY: number = newPos.y;
        //Check if we are trying to move out of the map
        if (newPos.x < 0) {
            //newPos is to the left of the map boundary
            correctX = 1;
        }
        if (newPos.y < 0) {
            //newPos is above the map boundary
            correctY = 1;
        }
        if ((newPos.x + this.transform.width) > this.world.worldSize.x) {
            //newPos is to the right of the map boundary
            correctX = this.world.worldSize.x - (this.transform.width + 1);
        }
        if ((newPos.y + this.transform.height) > this.world.worldSize.y) {
            //newPos is below the map boundary
            correctY = this.world.worldSize.y - (this.transform.height + 1);
        }

        const correctPos = new Vector2D(correctX, correctY);
        if (!newPos.equals(correctPos)) {
            console.log("Collided with map boundary");
            this.transform.position = correctPos;
            return correctPos;
        }

        let canMove: boolean = true;

        //Preliminary collision checking
        for (let ent of this.world.getAllEntities()) {
            if (ent.occupiesPosition(newPos)) {
                if (ent.id == this.id)
                    continue;

                //Position is occupied, cannot move!
                console.log(`${this.name} collided with ${ent.name}`);
                canMove = this.onCollision(ent);
            }
        }

        if (canMove) {
            this.transform.position = newPos;
            return newPos;
        }

        return this.transform.position;
    }

    private onCollision(other: Entity): boolean {
        switch (other.type) {
            case EntityType.Page:
                //Collect and move
                return true;
            case EntityType.Slender:
                //Death
                return true;
            case EntityType.Tree:
                return true;
            default:
                //Blocked
                return false;
        }
    }

    private checkMovement(dt: number): Vector2D {
        let dir: Direction = Direction.None;

        if (Input.getKey("w")) {
            dir = Direction.Up;
        }
        if (Input.getKey("s")) {
            if (dir == Direction.None) {
                dir = Direction.Down;
            } else {
                dir = dir | Direction.Down;
            }
        }
        if (Input.getKey("a")) {
            if (dir == Direction.None) {
                dir = Direction.Left;
            } else {
                dir = dir | Direction.Left;
            }
        }
        if (Input.getKey("d")) {
            if (dir == Direction.None) {
                dir = Direction.Right;
            } else {
                dir = dir | Direction.Right;
            }
        }

        if (dir != Direction.None) {
            const angle = MovementController.getDegreesFromDirection(dir);

            if (angle != -1) {
                const newLocation = MovementController.getNewLocation(this.transform.position, angle, this.moveSpeed * dt);
                return this.move(newLocation);
            }
        }
        return null;
    }
}
