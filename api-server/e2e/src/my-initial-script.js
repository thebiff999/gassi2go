// start playwright with "node my-initial-script.js"
const { chromium } = require('playwright');

(async () => {
  // Make sure to run headed.
  const browser = await chromium.launch({ headless: false });

  // Setup context however you like.
  const context = await browser.newContext({ /* pass any options */ ignoreHTTPSErrors: true });
  context.addCookies([{name: 'lat', value: '51.2323', url: 'http://localhost:8080/',}, {name: 'lng', value: '7.6458', url: 'http://localhost:8080/'}]);

  // Pause the page, and start recording manually.
  const page = await context.newPage();
  await page.goto('http://localhost:8080');
  await page.pause();
})();