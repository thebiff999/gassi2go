/* Autor: Simon Flathmann */ 

import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { UserSession } from './user-session';
import config from './config';

describe('/auftrag/new', () => {
    let browser: Browser;
    let context: BrowserContext;
    let page: Page;
    let userSession: UserSession;

    beforeAll(async() => {
        browser = await chromium.launch(config.launchOptions);
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
        userSession = new UserSession(context);
        await userSession.registerUser();
    });

    afterEach(async () => {
        await userSession.deleteUser();
        await context.close();
    });

    it('should render the title "Auftragserstellung"', async() => {
        await page.goto(config.clientUrl('/auftrag/new'));
        const title = await page.textContent('app-header .title h2');
        expect(title).toBe('Auftragserstellung');
    });

});

