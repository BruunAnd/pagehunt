import Packet, {PacketType} from './packet';
import {EntityType} from "../entities/entity";

export default class SpawnEntityPacket extends Packet {
    public x: number;
    public y: number;
    public id: number;
    public entity: EntityType;
    public solid: boolean;
    public name: string;
    public speed: number;
    public light: number;

    constructor(packetDict: any) {
        super(PacketType.SpawnEntity);

        const entity = packetDict['entity'];

        this.x = entity['x'];
        this.y = entity['y'];
        this.id = entity['id'];
        this.entity = entity['type'];
        this.solid = entity['solid'];
        this.speed = entity['speed'] || null;
        this.name = entity['name'] || null;
        this.light = entity['light'] || null;
    }

    public dictify(): any {
        throw 5;
    }
}