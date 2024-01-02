export class ResponseStatus {
    constructor(public message: string, public code?: number) {}

    static fromString(value: string): ResponseStatus {
        const parts = value.split(" ", 2);

        if (parts.length === 1) {
            return new ResponseStatus(value);
        }

        const code = parseInt(parts[0], 10);

        if (Number.isNaN(code)) {
            return new ResponseStatus(value);
        }

        return new ResponseStatus(parts[1], code);
    }

    public toJSON(): string {
        return `${this.code} ${this.message}`;
    }

    public isSuccessful(): boolean {
        return this.code !== undefined && this.code >= 200 && this.code < 300;
    }
}
