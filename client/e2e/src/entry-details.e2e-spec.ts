/* Autor: Dennis Heuermann */

import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { UserSession } from './user-session';
import config from './config';

describe('entries', () => {
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
        context.addCookies([{name: 'lat', value: '51.2323', url: 'http://localhost:8080/',}, {name: 'lng', value: '7.6458', url: 'http://localhost:8080/'}]);
        page = await context.newPage();
        userSession = new UserSession(context);
        await userSession.registerUser();
    });

    afterEach(async () => {
        await userSession.deleteUser();
        await context.close();
    });

    const createEntry = async () => {
        //navigate to auftragserstellung
        await page.goto(config.clientUrl('/search'));
        await page.click('.rightLine');
        await page.click('text=Meine Hunde');

        //add dog
        await page.click('text=Hund hinzufügen');
        await page.click('[placeholder="Max"]');
        await page.fill('[placeholder="Max"]', 'Wuffi');
        await page.press('[placeholder="Max"]', 'Tab');
        await page.fill('[placeholder="Bernasenne"]', 'Dackel');
        await page.press('[placeholder="Bernasenne"]', 'Tab');
        await page.press('input[type="date"]', 'Tab');
        await page.press('input[type="date"]', 'Shift+Tab');
        await page.fill('input[type="date"]', '2015-02-18');
        await page.press('input[type="date"]', 'Tab');
        await page.press('text=Foto hochladen', 'Tab');
        await page.fill('textarea', 'Wuffi ist ein ganz lieber und kann auch gut mit Kindern.');
        await page.click('text=Hund anlegen');

        //add entry
        await page.goto('http://localhost:8080/app/user/dogs');
        await page.click('text=Auftrag erstellen');
        await page.click('#inputHunde');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');
        await page.click('[placeholder="Entlohnung"]');
        await page.fill('[placeholder="Entlohnung"]', '20');
        await page.press('[placeholder="Entlohnung"]', 'Tab');
        await page.fill('[placeholder="Beispielstraße"]', 'Friedenstraße');
        await page.press('[placeholder="Beispielstraße"]', 'Tab');
        await page.fill('[placeholder="42"]', '7');
        await page.press('[placeholder="42"]', 'Tab');
        await page.fill('[placeholder="12345"]', '48485');
        await page.press('[placeholder="12345"]', 'Tab');
        await page.fill('[placeholder="Musterort"]', 'Neuenkirchen');
        await page.press('[placeholder="Musterort"]', 'Tab');
        await page.fill('textarea', 'Unser Wuffi braucht Auslauf. Er ist super lieb und kann auch gut mit Kindern.');
        page.click('button:has-text("Auftrag erstellen")');
        await page.click('button:has-text("Auftrag erstellen")');
    };

    it('should render the entry-details', async () => {
        createEntry();
    });

    it('should render an error when accessing assigned entry-details', async () => {

    });

    it('should render an error when requesting a non-existing id', async() => {

    });

    it('should return to the entry overview when clicking on back', async () => {

    });

    it('should not render an assigend entry', async () => {

    });
});