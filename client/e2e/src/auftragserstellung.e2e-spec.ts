/* Autor: Simon Flathmann */

import { Browser, BrowserContext, Page, chromium } from 'playwright';
import { UserSession } from './user-session';
import config from './config';

describe('/entries/new', () => {
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
    /* Der vorhandene Service user-session wurde mit Methode zur Hundeerstellung erweitert 
        und an die eigene Registrierung angepasst */
    await userSession.createDog();
  });

  afterEach(async () => {
    await userSession.deleteUser(); //Löscht gleich alle zugehörigen Hunde/Aufträge mit
    await context.close();
  });

  it('should render the title "Auftragserstellung"', async () => {
    await page.goto(config.clientUrl('/entries/new'));
    const title = await page.textContent('app-header .title h2');
    expect(title).toBe('Auftragserstellung');
  });

  it('should sucessfully create an entry', async () => {
    await page.goto(config.clientUrl('/entries/new'));
    await page.fill('input[type="date"]', '2021-09-30');
    await page.selectOption('#inputHunde', { label: 'Janka' });
    await page.fill('[placeholder="Entlohnung"]', '10.00');
    await page.fill('[placeholder="Beispielstraße"]', 'Corrensstraße');
    await page.fill('[placeholder="42"]', '25');
    await page.fill('[placeholder="12345"]', '48159');
    await page.fill('[placeholder="Musterort"]', 'Münster');
    await page.fill(
      'textarea',
      'Mit dem Hund kann man gut an der Leine laufen. Ich gebe Ihnen Leckerlies mit, die Sie an ihn verfüttern können!'
    );
    expect(
      await Promise.all([
        page.waitForResponse(response => response.status() === 201),
        await page.click('button:has-text("Auftrag erstellen")')
      ])
    ).toBeTrue;
  });

  it('should show invalid-feedback when no dog was chosen', async () => {
    await page.goto(config.clientUrl('/entries/new'));
    await page.fill('input[type="date"]', '2021-09-30');
    await page.fill('[placeholder="Entlohnung"]', '10.00');
    await page.fill('[placeholder="Beispielstraße"]', 'Corrensstraße');
    await page.fill('[placeholder="42"]', '25');
    await page.fill('[placeholder="12345"]', '48159');
    await page.fill('[placeholder="Musterort"]', 'Münster');
    await page.fill(
      'textarea',
      'Mit dem Hund kann man gut an der Leine laufen. Ich gebe Ihnen Leckerlies mit, die Sie an ihn verfüttern können!'
    );
    await page.click('button:has-text("Auftrag erstellen")');
    const error = await page.textContent('app-auftragserstellung .invalid-feedback:visible'); //nur eingeblendete Fehlermeldungen
    expect(error).toBe('Bitte wählen Sie einen Hund aus.');
  });

  it('should show invalid-feedback when plz does not match the ReqExr', async () => {
    await page.goto(config.clientUrl('/entries/new'));
    await page.fill('input[type="date"]', '2021-09-30');
    await page.selectOption('#inputHunde', { label: 'Janka' });
    await page.fill('[placeholder="Entlohnung"]', '10.00');
    await page.fill('[placeholder="Beispielstraße"]', 'Corrensstraße');
    await page.fill('[placeholder="42"]', '25');
    await page.fill('[placeholder="12345"]', '48a5x');
    await page.fill('[placeholder="Musterort"]', 'Münster');
    await page.fill(
      'textarea',
      'Mit dem Hund kann man gut an der Leine laufen. Ich gebe Ihnen Leckerlies mit, die Sie an ihn verfüttern können!'
    );
    await page.click('button:has-text("Auftrag erstellen")');
    const error = await page.textContent('app-auftragserstellung .invalid-feedback:visible');
    expect(error).toBe('Bitte geben Sie eine gültige Postleitzahl ein.');
  });

  it('should show invalid-feedback when "entlohnung" is below zero', async () => {
    await page.goto(config.clientUrl('/entries/new'));
    await page.fill('input[type="date"]', '2021-09-30');
    await page.selectOption('#inputHunde', { label: 'Janka' });
    await page.fill('[placeholder="Entlohnung"]', '-10.00');
    await page.fill('[placeholder="Beispielstraße"]', 'Corrensstraße');
    await page.fill('[placeholder="42"]', '25');
    await page.fill('[placeholder="12345"]', '48159');
    await page.fill('[placeholder="Musterort"]', 'Münster');
    await page.click('button:has-text("Auftrag erstellen")');
    await page.fill(
      'textarea',
      'Mit dem Hund kann man gut an der Leine laufen. Ich gebe Ihnen Leckerlies mit, die Sie an ihn verfüttern können!'
    );
    const error = await page.textContent('app-auftragserstellung .invalid-feedback:visible');
    expect(error).toBe('Die Entlohnung ist erforderlich und darf nicht im negativen Bereich liegen.');
  });

  it('should show 3 invalid-feedback messages when required fields are not set', async () => {
    await page.goto(config.clientUrl('/entries/new'));
    await page.fill('input[type="date"]', '2021-09-30');
    await page.selectOption('#inputHunde', { label: 'Janka' });
    await page.fill('[placeholder="Entlohnung"]', '10.00');
    await page.fill('[placeholder="12345"]', '48159');
    await page.click('button:has-text("Auftrag erstellen")');
    await page.fill(
      'textarea',
      'Mit dem Hund kann man gut an der Leine laufen. Ich gebe Ihnen Leckerlies mit, die Sie an ihn verfüttern können!'
    );
    const errorCount = await page.$$eval('app-auftragserstellung .invalid-feedback:visible', elems => elems.length);
    expect(errorCount).toBe(3);
  });

  it('should show invalid-feedback when the description is too short', async () => {
    await page.goto(config.clientUrl('/entries/new'));
    await page.fill('input[type="date"]', '2021-09-30');
    await page.selectOption('#inputHunde', { label: 'Janka' });
    await page.fill('[placeholder="Entlohnung"]', '10.00');
    await page.fill('[placeholder="Beispielstraße"]', 'Corrensstraße');
    await page.fill('[placeholder="42"]', '25');
    await page.fill('[placeholder="12345"]', '48159');
    await page.fill('[placeholder="Musterort"]', 'Münster');
    await page.click('button:has-text("Auftrag erstellen")');
    await page.fill('textarea', 'Dieser Text ist zu kurz.');
    const error = await page.textContent('app-auftragserstellung .invalid-feedback:visible');
    expect(error).toBe('Die Beschreibung ist erforderlich und muss 30 bis 900 Zeichen lang sein.');
  });
});
