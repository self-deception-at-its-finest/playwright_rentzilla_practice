import {test, expect} from "../../../fixtures/api.fixture";
import { faker } from '@faker-js/faker';

test.describe("User Auth", () => {
    test("User can get JWT token", async ({authService}) => {
        const response = await authService.login()

        expect(response.status()).toBe(201);

        const responseJson = await response.json();

        expect(responseJson.access).toBeTruthy();
        expect(responseJson.refresh).toBeTruthy();

        expect(responseJson.access.split(".")).toHaveLength(3);
    });
    test("User cant get JWT token with invalid password", async ({authService}) => {
        const response = await authService.login({
            password: faker.internet.password()
        })

        expect(response.status()).toBe(400);
    })
    test("User cant get JWT token with invalid email", async ({authService}) => {
        const response = await authService.login({
            email: faker.internet.email(),
        })

        expect(response.status()).toBe(400);
    })
    test("User cant get JWT token with empty password", async ({authService}) => {
        const response = await authService.login({
            password: ""
        })

        expect(response.status()).toBe(400);
    })
    test("User cant get JWT token without password field", async ({request}) => {
        const response = await request.post("https://dev.rentzila.com.ua/api/auth/jwt/create/", {
            data: {
                email: process.env.TEST_USER_EMAIL
            }
        });

        expect(response.status()).toBe(400);
    })
    test("User cant get JWT token without email field", async ({request}) => {
        const response = await request.post("https://dev.rentzila.com.ua/api/auth/jwt/create/", {
            data: {
                password: process.env.TEST_USER_PASSWORD,
            }
        });

        expect(response.status()).toBe(400);
    })
    test("SQL injection", async ({authService}) => {
        const response = await authService.login({
            email: "' OR 1=1 --",
        })

        expect(response.status()).toBe(400);
    })
    test("User can refresh access token", async ({authService}) => {
        const response = await authService.login()

        expect(response.status()).toBe(201);

        const loginBody = await response.json();

        const refreshToken = loginBody.refresh;

        expect(refreshToken).toBeTruthy();

        const refreshResponse = await authService.refreshTokenRequest(refreshToken);

        expect(refreshResponse.status()).toBe(200);

        const refreshBody = await refreshResponse.json();

        expect(refreshBody.access).toBeTruthy();
    })
    test("User cant refresh access token with wrong refresh token", async ({authService}) => {
        const refreshResponse = await authService.refreshTokenRequest(faker.string.alphanumeric(100));

        expect(refreshResponse.status()).toBe(406);
    })
});