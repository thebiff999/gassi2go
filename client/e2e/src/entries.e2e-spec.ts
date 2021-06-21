/* Autor: Dennis Heuermann */

import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { UserSession } from './user-session';
import config from './config';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

describe('entries', () => {
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
    context.addCookies([
      { name: 'lat', value: '51.2323', url: 'http://localhost:8080/' },
      { name: 'lng', value: '7.6458', url: 'http://localhost:8080/' }
    ]);
    page = await context.newPage();
    userSession = new UserSession(context);
    await userSession.registerUser();
  });

  afterEach(async () => {
    await userSession.deleteUser();
    await context.close();
  });
  const name = 'Wuffi' + uuidv4();
  const image = fs.readFileSync(__dirname + '/../../../api-server/resources/default.txt').toString();
  const id = uuidv4();
  const entry = {
    art: 'walk',
    datum: '2022-12-12',
    entlohnung: 20,
    status: 'open',
    beschreibung: 'Wuffi ist ein ganz lieber und kann gut mit Kindern',
    hundId: id,
    hundName: name,
    hundRasse: 'Dackel',
    lat: '5.0000',
    lng: '40.0000',
    imgName: 'defaultImage',
    imgData: image
  };

  it('should render the title "Auftragssuche"', async () => {
    await page.goto(config.clientUrl('/search'));
    const pageTitle = await page.textContent('app-header .title h2');
    expect(pageTitle).toBe('Auftragssuche');
  });

  it('should render newly added entries', async () => {
    await userSession.createEntry(entry);

    await page.goto('http://localhost:8080/app', { waitUntil: 'networkidle' });
    expect(await page.$('text=Name: ' + name)).not.toBeNull();
  });

  it('should not render an assigend entry', async () => {
    await userSession.createEntry(entry);

    await page.goto('http://localhost:8080/app/');
    await Promise.all([page.click('text=Führ mich aus'), page.waitForNavigation()]);
    await page.click('text=Ich führe dich aus');
    await page.goto('http://localhost:8080/app/');
    expect(await page.$('text=Name: ' + name)).toBeNull();
  });
});
