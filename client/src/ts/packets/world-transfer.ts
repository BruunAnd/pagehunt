import Packet, {PacketType} from './packet';
import World from '../world';
import Vector2D from "../vector2d";

export default class WorldTransferPacket extends Packet {
    world: World;

    constructor(packetDict: any) {
        super(PacketType.WorldTransfer);
        const world: World = new World(new Vector2D(packetDict['world']['size'], packetDict['world']['size']));

        const entities = Array.from(packetDict['world']['entities']);
        entities.forEach(function (ent: any) {
            world.addEntity(world.constructEntity(ent))
        });

        this.world = world;
    }

    public dictify(): any {
        throw 5;
    }
}