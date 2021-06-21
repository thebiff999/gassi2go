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

  it('should render the title "Hundeerstellung"', async () => {
    await page.goto(config.clientUrl('/user/dogs/new'));
    const title = await page.textContent('app-header .title h2');
    expect(title).toBe('Hundeerstellung');
  });

  it('should sucessfully create a dog with the default-image', async () => {
    await page.goto(config.clientUrl('/user/dogs/new'));
    await page.fill('[placeholder="Max"]', 'Lucky');
    await page.fill('[placeholder="Bernasenne"]', 'Golden Retriever');
    await page.fill('input[type="date"]', '2014-07-10');
    await page.fill(
      'textarea',
      'Lucky ist ein richtiger Frechdachs! Wenn er nicht an der Leine läuft, ist er sofort weg.'
    );
    expect(
      await Promise.all([
        page.waitForResponse(response => response.status() === 201),
        await page.click('text=Hund anlegen')
      ])
    ).toBeTrue;
  });

  it('should show an invalid-feedback for every required field', async () => {
    await page.goto(config.clientUrl('/user/dogs/new'));
    await page.click('text=Hund anlegen');
    const errorCount = await page.$$eval('app-hundeerstellung .invalid-feedback:visible', elems => elems.length);
    expect(errorCount).toBe(4);
  });

  it('should show invalid-feedback when the date of birth is in the future', async () => {
    await page.goto(config.clientUrl('/user/dogs/new'));
    await page.fill('[placeholder="Max"]', 'Lucky');
    await page.fill('[placeholder="Bernasenne"]', 'Golden Retriever');
    await page.fill('input[type="date"]', '2023-07-10');
    await page.fill(
      'textarea',
      'Lucky ist ein richtiger Frechdachs! Wenn er nicht an der Leine läuft, ist er sofort weg.'
    );
    await page.click('text=Hund anlegen');
    const error = await page.textContent('app-hundeerstellung .invalid-feedback:visible');
    expect(error).toBe('Bitte wähle ein valides Datum.');
  });

  it('should show invalid-feedback when the additional informations are too short', async () => {
    await page.goto(config.clientUrl('/user/dogs/new'));
    await page.fill('[placeholder="Max"]', 'Lucky');
    await page.fill('[placeholder="Bernasenne"]', 'Golden Retriever');
    await page.fill('input[type="date"]', '2013-07-10');
    await page.fill('textarea', 'Viel zu kurz.');
    await page.click('text=Hund anlegen');
    const error = await page.textContent('app-hundeerstellung .invalid-feedback:visible');
    expect(error).toBe(
      'Die Zusätzlichen Informationen sind erforderlich und müssen zwischen 30 und 600 Zeichen lang sein.'
    );
  });
});
