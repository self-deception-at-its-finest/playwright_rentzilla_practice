import { APIRequestContext } from "@playwright/test";

export class AuthService {

    constructor(private request: APIRequestContext) {}

    async login({email = process.env.TEST_USER_EMAIL!, password = process.env.TEST_USER_PASSWORD!} = {}) {
        return this.request.post("https://dev.rentzila.com.ua/api/auth/jwt/create/", {
            data: {
                email: email,
                password: password,
            }
        });
    }

    async refreshTokenRequest(refresh: string) {
        return this.request.post("https://dev.rentzila.com.ua/api/auth/jwt/refresh/", {
            data: { refresh }
        });
    }
}