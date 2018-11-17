export default class Util {
    public static getRandomRange(min: number, max: number){
        return Math.random() * (max - min) + min;
    }
}