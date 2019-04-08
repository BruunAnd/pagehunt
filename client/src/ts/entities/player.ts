import Vector2D from "../vector2d";
import World, {WorldLayer} from "../world";
import Input from "../input";
import MovementController, {Direction} from "../controls/movement";
import Entity, {EntityType} from "./entity";
import Transform from "../transform";
import LuminousEntity from "./luminous-entity";

export default class Player extends LuminousEntity {
    world: World;
    private readonly moveSpeed: number;

    constructor(id: number, sprite: HTMLImageElement, world: World, moveSpeed: number, initialLight: number, name?: string, transform?: Transform) {
        super(id, EntityType.LocalPlayer, sprite, false, name != null ? name : "Unknown Player", WorldLayer.Player,
              initialLight, 100, .4, false, transform);
        this.world = world;
        this.moveSpeed = moveSpeed;
    }

    public tick(dt: number): void {
        this.checkMovement(dt);
        super.tick(dt);
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
                canMove = !ent.solid;
            }
        }

        if (canMove) {
            this.transform.position = newPos;
            return newPos;
        }

        return this.transform.position;
    }

    /*
    private onCollision(other: Entity): void {
        switch (other.type) {

        }
    }
     */

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
