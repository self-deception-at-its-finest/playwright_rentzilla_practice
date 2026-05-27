import { test as base } from "@playwright/test";
import { AuthService } from "../tests/api/services/auth.service";

type ApiFixtures = {
    authService: AuthService;
};

export const test = base.extend<ApiFixtures>({
    authService: async ({ request }, use) => {

        const authService = new AuthService(request);

        await use(authService);
    },
});

export { expect } from "@playwright/test";