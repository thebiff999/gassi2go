/* Autor: Dennis Heuermann */

import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { UserSession } from './user-session';
import config from './config';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

describe('assignments', () => {
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
  const name = 'Wuffi' + uuidv4().toString();
  const image = fs.readFileSync(__dirname + '/../../../api-server/resources/default.txt').toString();
  const entry = {
    art: 'walk',
    datum: '2022-12-12',
    entlohnung: 20,
    status: 'open',
    beschreibung: 'Wuffi ist ein ganz lieber und kann gut mit Kindern',
    hundName: name,
    hundRasse: 'Dackel',
    lat: '5.0000',
    lng: '40.0000',
    imgName: 'defaultImage',
    imgData: image
  };

  it('should render the assignment', async () => {
    await userSession.createDog(name);
    await userSession.createEntry(entry);

    await page.goto('http://localhost:8080/app/');
    await Promise.all([page.click('text=Führ mich aus'), page.waitForNavigation()]);
    await page.click('text=Ich führe dich aus');
    await page.goto('http://localhost:8080/app/user/entries');
    await page.screenshot({ path: 'screenshots/assigned-assignment.png' });
    const text = 'text=' + name;
    expect(await page.$(text)).not.toBeNull();
  }, 10000);

  it('should not render assignments', async () => {
    await page.goto('http://localhost:8080/app/user/entries');
    const text = 'text=' + name;
    expect(await page.$(text)).toBeNull();
  });

  it('should display an error message when there are no assigned entries', async () => {
    await page.goto('http://localhost:8080/app/user/entries');
    expect(await page.$('text=Keine zugeordneten Aufträge')).not.toBeNull();
  });

  /*it('should delete done assignments from frontend', async () => {
        await userSession.createDog(name);
        await userSession.createEntry(entry);

        await page.goto('http://localhost:8080/app/');
        await page.click('text=Führ mich aus');
        await page.click('text=Ich führe dich aus');
        await page.goto('http://localhost:8080/app/user/entries');
        await page.click('.button');
        await page.screenshot({path: 'screenshots/done-assignment.png'});
        const text = 'text=' + name;
        expect(await page.$(text)).toBeNull();
    });*/
});
