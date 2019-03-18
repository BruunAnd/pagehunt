import Packet, {PacketType} from "./packet";
import Vector2D from "../vector2d";

export default class MovementPacket extends Packet {
    constructor(private newLocation: Vector2D) {
        super();
    }

    public dictify(): any {
        return {'type': this.getType(), 'x': this.newLocation.x, 'y': this.newLocation.y};
    }

    public getType(): PacketType {
        return PacketType.Movement;
    }
}