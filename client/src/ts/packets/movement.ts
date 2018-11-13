import Packet, {PacketType} from "./packet";
import Vector2 from "../vector2";

export class MovementPacket extends Packet {
    constructor(private newLocation: Vector2) {
        super();
    }

    public dictify(): any {
        return {'type': this.getType(), 'x': this.newLocation.x, 'y': this.newLocation.y};
    }

    public getType(): PacketType {
        return PacketType.Movement;
    }
}