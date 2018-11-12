export default class Input {
    static input: string[] = [];

    public static addKey(key: string): void {
        const index: number = this.input.indexOf(key);
        if (index == -1) {
            this.input.push(key);
        }
    }

    public static removeKey(key: string): void {
        const index: number = this.input.indexOf(key);
        if (index > -1) {
            this.input.splice(index, 1);
        }
    }

    public static getKey(key: string): boolean {
        const index: number = this.input.indexOf(key);
        return index > -1;
    }
}