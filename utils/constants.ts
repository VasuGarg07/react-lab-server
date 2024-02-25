export const AccessTokenValidity = 2 * 60 * 60 * 1000;
export const RefreshTokenValidity = 24 * 60 * 60 * 1000;

export class TokenVerifictionError extends Error {
    errorCode: number;
    constructor(message: string, errorCode: number) {
        super(message);
        this.errorCode = errorCode;
    }
}