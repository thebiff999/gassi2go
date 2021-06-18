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
        /*Vorhandenen Service User-Service erweitert mit Methode zur Hundeerstellung 
        und Anpassung an eigene Registrierung. */
        await userSession.createDog();
    });

    afterEach(async () => {
        await userSession.deleteUser(); //Löscht gleich alle zugehörigen Hunde/Aufträge mit
        await context.close();
    });

    it('should render the title "Auftragserstellung"', async() => {
        await page.goto(config.clientUrl('/auftrag/new'));
        const title = await page.textContent('app-header .title h2');
        expect(title).toBe('Auftragserstellung');
    });

    it('should sucessfully create an entry', async() => {
        await page.goto(config.clientUrl('/auftrag/new'));
        await page.fill('input[type="date"]', '2021-09-30');
        await page.selectOption('#inputHunde', {label: 'Janka'});
        await page.fill('[placeholder="Entlohnung"]', '10.00');
        await page.fill('[placeholder="Beispielstraße"]', 'Corrensstraße');
        await page.fill('[placeholder="42"]', '25');
        await page.fill('[placeholder="12345"]', '48159');
        await page.fill('[placeholder="Musterort"]', 'Münster');
        await page.fill('textarea', 'Mit dem Hund kann man gut an der Leine laufen. Ich gebe Ihnen Leckerlies mit, die Sie an ihn verfüttern können!');
        expect(await Promise.all([page.waitForResponse(response => response.status() === 201), await page.click('button:has-text("Auftrag erstellen")')])).toBeTrue;
    });

});


