import Packet, {PacketType} from "./packet";
import Vector2D from "../vector2d";

export default class MovementPacket extends Packet {
    constructor(private newLocation: Vector2D) {
        super(PacketType.Movement);
    }

    public dictify(): any {
        return {'type': this.packetType, 'x': this.newLocation.x, 'y': this.newLocation.y};
    }
}