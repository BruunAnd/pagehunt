import MapEntity, { EntityType } from "./map-entity";
import Vector2D from "../vector2d";
import GameMap from "../game-map";
import Input from "../input";
import MovementController from "../controls/movement";
import { Game } from "../game";
import { MovementPacket } from "../packets/movement";

export enum Direction {
    None = 0,
    Up = 1 << 0,    // 0001 -- the bitshift is unnecessary, but done for consistency
    Down = 1 << 1,  // 0010
    Left = 1 << 2,  // 0100
    Right = 1 << 3, // 1000
}

export default class Player extends MapEntity {
    light: number;

    constructor(game: Game, id: number, name?: string, pos?: Vector2D) {
        if (name) {
            if (pos) {
                super(game, id, EntityType.LocalPlayer, name, pos);
            } else {
                super(game, id, EntityType.LocalPlayer, name);
            }
        } else {
            super(game, id, EntityType.LocalPlayer);
        }
        this.light = 100;
    }

    public tick(dt: number): void {
        this.checkMovement(dt);
    }

    public render() {
        // Remove the fog of war in circle based on the light value
        this.game.drawContext.beginPath();
            const test = this.game.drawContext.globalCompositeOperation;
            this.game.drawContext.globalCompositeOperation = 'destination-out';
            this.game.drawContext.fillStyle = '#fff293';
            this.game.drawContext.arc(this.pos.x - this.game.camera.getPosition().x, this.pos.y - this.game.camera.getPosition().y, this.light,0,Math.PI*2,true);
            this.game.drawContext.fill();
            this.game.drawContext.globalCompositeOperation = test;
        this.game.drawContext.closePath();
        // Draw the player
        this.game.drawContext.beginPath();
            this.game.drawContext.fillStyle = '#00FF00';
            this.game.drawContext.fillRect(this.pos.x - this.game.camera.getPosition().x, this.pos.y - this.game.camera.getPosition().y, this.width, this.height);
            this.game.drawContext.fillStyle = '#FFFFFF';
            this.game.drawContext.fillText(this.name, this.pos.x - this.game.camera.getPosition().x, (this.pos.y - 8) - this.game.camera.getPosition().y);
        this.game.drawContext.closePath();
    }

    public move(newPos: Vector2D, map: GameMap): Vector2D {
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
        if ((newPos.x + this.width) > map.mapSize.x) {
            //newPos is to the right of the map boundary
            correctX = map.mapSize.x - (this.width + 1);
        }
        if ((newPos.y + this.height) > map.mapSize.y) {
            //newPos is below the map boundary
            correctY = map.mapSize.y - (this.height + 1);
        }

        let correctPos = new Vector2D(correctX, correctY);
        if (!newPos.equals(correctPos)) {
            console.log("Collided with map boundary");
            this.pos = correctPos;
            return correctPos;
        }

        let canMove: boolean = true;

        //Preliminary collision checking
        for (let ent of map.getEntities()) {
            if (ent.occupiesPosition(newPos)) {
                if (ent.id == this.id)
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
        /* This should NOT be on the client! Only on the server */
        switch (other.type) {
            case EntityType.Page:
                //Collect and move
                //
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
