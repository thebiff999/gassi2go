/* Autor: Dennis Heuermann */

import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { UserSession } from './user-session';
import config from './config';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

describe('entry-details', () => {
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
  const entry = {
    art: 'walk',
    datum: '2022-12-12',
    entlohnung: 20,
    status: 'open',
    beschreibung: 'Wuffi ist ein ganz lieber und kann gut mit Kindern',
    hundId: '12345',
    hundName: name,
    hundRasse: 'Dackel',
    lat: '5.0000',
    lng: '40.0000',
    imgName: 'defaultImage',
    imgData: image
  };

  it('should render the title "Auftrag Detailansicht"', async () => {
    await page.goto(config.clientUrl('/entries/12345'));
    const pageTitle = await page.textContent('app-header .title h2');
    expect(pageTitle).toBe('Auftrag Detailansicht');
  });

  it('should render the entry-details', async () => {
    await userSession.createEntry(entry);

    await page.goto('http://localhost:8080/app/');
    await Promise.all([page.click('text=Führ mich aus'), page.waitForNavigation()]);
    expect(await page.$('text=' + name)).not.toBeNull();
  }, 10000);

  it('should render an error when accessing assigned entry-details', async () => {
    await userSession.createEntry(entry);

    //navigate to the entry-details view
    await page.goto('http://localhost:8080/app/');
    await page.click('text=Führ mich aus');
    const url = await page.url();
    await page.click('text=Ich führe dich aus');
    await page.goto('http://localhost:8080/app/');
    await page.goto(url, { waitUntil: 'networkidle' });

    expect(await page.$('text=Der Eintrag ist bereits im Status "zugeordnet"')).not.toBeNull();
  }, 10000);

  it('should render an error when requesting a non-existing id', async () => {
    const wrongId = uuidv4();
    await page.goto('http://localhost:8080/app/entries/' + wrongId);
    expect(await page.$('text=Dieser Eintrag existiert nicht')).not.toBeNull();
  });

  it('should automatically return to the entry overview after clicking on the request button', async () => {
    await userSession.createEntry(entry);

    await page.goto('http://localhost:8080/app');
    await page.click('text=Führ mich aus');
    await Promise.all([page.waitForNavigation(), page.click('text=Ich führe dich aus')]);

    expect(page.url()).toBe('http://localhost:8080/app/');
  }, 10000);

  it('should return to the entry overview when clicking on back', async () => {
    await userSession.createEntry(entry);

    await page.goto('http://localhost:8080/app');
    await page.click('text=Führ mich aus');
    await page.click('#desktop-button');
    expect(page.url()).toBe('http://localhost:8080/app/');
  }, 10000);
});
