export class ErrorResponse {
    message!: string;

    constructor(message: string) {
        this.message = message;
    }
}

export class UnauthResponse {
    message!: string;

    constructor(message: string) {
        this.message = message;
    }
}