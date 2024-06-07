/**
 * Creates a response status object.
 */
export class ResponseStatus {
    /**
     * Creates a response status object.
     *
     * @param message Complete response.
     * @param code Response code from the message.
     */
    constructor(
        public message: string,
        public code?: number,
    ) {}

    /**
     * Creates a response status object from a string.
     *
     * @param value Status string.
     *
     * @returns A response status object.
     */
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

    /**
     * Converts a response status object to a JSON string.
     *
     * @returns A JSon string.
     */
    public toJSON(): string {
        return `${this.code} ${this.message}`;
    }

    /**
     * Is the status successful.
     *
     * @returns True if successful, false if not.
     */
    public isSuccessful(): boolean {
        return this.code !== undefined && this.code >= 200 && this.code < 300;
    }
}
