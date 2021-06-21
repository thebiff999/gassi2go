/* Autor: Prof. Dr. Norman Lahme-Hütig (FH Münster) */

import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { UserSession } from './user-session.js';
import config from './config.js';

describe('/users/sign-in', () => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;
  let userSession: UserSession;

  beforeAll(async ()=> {
    browser = await chromium.launch(config.launchOptions);
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    context = await browser.newContext();
    page = await context.newPage();
    userSession = new UserSession(context);
  });

  afterEach(async () => {
    await context.close();
  });

  it('should render the title "Anmelden"', async () => {
    await page.goto(config.clientUrl('/users/sign-in'));
    const title = await page.textContent('app-sign-in h1');
    expect(title).toEqual('Anmelden');
  });

  it('should fail given wrong credentials', async () => {
    await page.goto(config.clientUrl('/users/sign-in'));
    await page.fill('input:below(:text("mail"))', userSession.email);
    await page.fill('input:below(:text("Passwort"))', userSession.password);
    const [response] = await Promise.all([page.waitForResponse('**/sign-in'), page.click('button:text("Anmelden")')]);
    expect(response.status()).toEqual(401);
  });

  it('should render "E-Mail oder Passwort falsch" on login failure', async () => {
    await page.goto(config.clientUrl('/users/sign-in'));
    await page.fill('input:below(:text("mail"))', userSession.email);
    await page.fill('input:below(:text("Passwort"))', userSession.password);
    await Promise.all([page.waitForResponse('**/sign-in'), page.click('button:text("Anmelden")')]);
    expect(await page.$('text="E-Mail oder Passwort ungültig!"')).not.toBeNull();
  });

  it('should succeed given proper credentials', async () => {
    await userSession.registerUser();
    await page.goto(config.clientUrl('/users/sign-in'));
    await page.fill('input:below(:text("mail"))', userSession.email);
    await page.fill('input:below(:text("Passwort"))', userSession.password);
    const [response] = await Promise.all([page.waitForResponse('**/sign-in'), page.click('button:text("Anmelden")')]);
    expect(response.status()).toEqual(201);
    await userSession.deleteUser();
  });
});
