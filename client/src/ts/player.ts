import MapEntity, { EntityType } from "./map-entity";
import Vector2 from "./vector2";
import Map from "./map";
import Input from "./input";
import MovementController from "./movement";
import { Game } from "./game";
import { MovementPacket } from "./packets/movement";

export enum Direction {
    None = 0,
    Up = 1 << 0,    // 0001 -- the bitshift is unnecessary, but done for consistency
    Down = 1 << 1,  // 0010
    Left = 1 << 2,  // 0100
    Right = 1 << 3, // 1000
}

export default class Player extends MapEntity {
    light: number;

    constructor(game: Game, id: number, name?: string, pos?: Vector2) {
        if (name) {
            if (pos) {
                super(game, id, EntityType.LocalPlayer, name, pos);
            }
            else {
                super(game, id, EntityType.LocalPlayer, name);
            }
        }
        else {
            super(game, id, EntityType.LocalPlayer);
        }
        this.light = 100;

        this.render = () => {
            this.game.drawContext.beginPath();
            this.game.drawContext.fillStyle = '#00FF00';
            this.game.drawContext.fillRect(this.pos.x - this.game.camera.getPosition().x, this.pos.y - this.game.camera.getPosition().y, this.width, this.height);
            this.game.drawContext.fillStyle = '#FFFFFF';
            this.game.drawContext.fillText(this.name, this.pos.x - this.game.camera.getPosition().x, (this.pos.y - 8) - this.game.camera.getPosition().y);
            this.game.drawContext.stroke();
            this.game.drawContext.closePath();

            requestAnimationFrame(this.render);
        }
    }

    public tick(dt: number): void {
        this.checkMovement(dt);
    }

    public move(newPos: Vector2, map: Map): Vector2 {
        let correctX: number = newPos.x;
        let correctY: number = newPos.y;
        //Check if we are trying to move out of the map
        if (newPos.x < 0){
            //newPos is to the left of the map boundary
            correctX = 1;
        }
        if (newPos.y < 0){
            //newPos is above the map boundary
            correctY = 1;
        }
        if ((newPos.x + this.width) > map.mapSize.x){
            //newPos is to the right of the map boundary
            correctX = map.mapSize.x - (this.width + 1);
        }
        if ((newPos.y + this.height) > map.mapSize.y) {
            //newPos is below the map boundary
            correctY = map.mapSize.y - (this.height + 1);
        }

        let correctPos = new Vector2(correctX, correctY);
        if (!newPos.equals(correctPos)) {
            console.log("Collided with map boundary");
            this.pos = correctPos;
            return correctPos;
        }


        let canMove: boolean = true;

        //Preliminary collision checking
        for (let ent of map.getMapEntities()) {
            if (ent.occupiesPosition(newPos)) {
                if (ent.id == this.id)
                    //Don't check our own collision :D
                    continue;
                //Position is occupied, cannot move!
                console.log(`${this.name} collided with ${ent.name}`);
                canMove = this.onCollision(ent);
            }
        }

        if (canMove) {
            this.pos = newPos;
            return newPos;
        }

        return this.pos;
    }

    private onCollision(other: MapEntity): boolean {
        switch (other.type) {
            case EntityType.Page:
                //Collect and move
                return true;
            case EntityType.Slender:
                //Death
                return true;
            default:
                //Blocked
                return false;
        }
    }

    private checkMovement(dt: number): void {
        let dir: Direction = Direction.None;

        if (Input.getKey("w")) {
            dir = Direction.Up;
        }
        if (Input.getKey("s")) {
            if (dir == Direction.None) {
                dir = Direction.Down;
            }
            else {
                dir = dir | Direction.Down;
            }
        }
        if (Input.getKey("a")) {
            if (dir == Direction.None) {
                dir = Direction.Left;
            }
            else {
                dir = dir | Direction.Left;
            }
        }
        if (Input.getKey("d")) {
            if (dir == Direction.None) {
                dir = Direction.Right;
            }
            else {
                dir = dir | Direction.Right;
            }
        }

        if (dir != Direction.None) {
            const moveSpeed = 10;
            const angle = MovementController.getDegreesFromDirection(dir);

            if (angle != -1) {
                const newLocation = MovementController.getNewLocation(this.pos, angle, moveSpeed * dt);
                const actualNewLocation = this.game.player.move(newLocation, this.game.map);
                this.game.networkClient.sendPacket(new MovementPacket(actualNewLocation));
                this.game.camera.setPosition(this.game.player.pos);
            }
        }
    }
}
