/* Autor: Simon Flathmann */

import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { UserSession } from './user-session';
import config from './config';

describe('/user/dogs/new', () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;
  let userSession: UserSession;

  beforeAll(async () => {
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
    //Löscht gleich alle zugehörigen Hunde/Aufträge mit
    await userSession.deleteUser();
    await context.close();
  });

  it('should render the title "Hundeübersicht"', async () => {
    await page.goto(config.clientUrl('/user/dogs'));
    const title = await page.textContent('app-header .title h2');
    expect(title).toBe('Meine Hunde');
  });

  it('should navigate to "/user/dogs/new"', async () => {
    await page.goto(config.clientUrl('/user/dogs'));
    await page.click('text=Hund hinzufügen');
    const title = await page.textContent('app-header .title h2');
    expect(title).toBe('Hundeerstellung');
  });

  it('should delete the dog', async () => {
    await userSession.createDog();
    await page.goto(config.clientUrl('/user/dogs'));
    const dogsBeforeDelete = await page.$$eval('#dogcard', elem => elem.length);
    expect(dogsBeforeDelete).toBe(1);
    page.on('dialog', dialog => dialog.accept()); //Löschen benötigt Bestätigung
    await Promise.all([page.waitForResponse('**'), await page.click('text=Löschen')]);
    const dogsAfterDelete = await page.$$eval('#dogcard', elem => elem.length);
    expect(dogsAfterDelete).toBe(0);
  }, 20000);
});
