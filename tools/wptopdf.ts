import puppeteer from 'puppeteer';
import { Page, Browser } from 'puppeteer';
import { getAccess } from '../utilities/getAccess';
import * as C from '../utilities/constants';
import * as cl from '../utilities/colorLog';
import fs from 'fs';

//ROOT && LANG imports
const URL = C.NavigationVariables.URL_ROOT;
const LANG = C.WptopdfVariables.SITE_LANG && `${C.WptopdfVariables.SITE_LANG}/`;
const MAIN_URL = URL + LANG;

//PAGE SELECTORS
const INDEX_LINKS = '.container_menu .menu-item > a';
const MENU = '#secondary';
const HEADER = '#masthead > div.wrapper-site-branding';
const BODY = '#primary';

//FUNCTIONS
async function startBrowser() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  return {browser, page};
}

async function closeBrowser(browser: Browser): Promise<void> {
  return browser.close();
}

async function browseWP(url: string) {
  const {browser, page} = await startBrowser();
  await getAccess(page, url);

  try {
    cl.Comment('Navigating to homepage: ' + MAIN_URL);
    await page.goto(MAIN_URL);
    await page.screenshot({path:'homepage.png'});
    fs.unlinkSync('homepage.png');
    process.env.NODE_ENV === 'debug' ? cl.Comment('Removed second screenshot') : null;
  } catch (err) {
    cl.Warn('Uh, something went wrong. Check `homepage.png` and error message.' + err);
    process.exit(-1);
  }
  await generatePDF(page);
  await closeBrowser(browser);
}

async function generatePDF(page: Page): Promise<void> {
  // Grab index links && export to pdf (path: 'PDF/')
  const links = await page.$$eval(INDEX_LINKS, e => e.map(e => e.href));
  const pages: string[] = [];

  // Create preliminar pages
  await page.$eval(BODY, e => e.remove());
  await page.pdf({
    path:'PDF/0.pdf',
    format: 'A4',
    printBackground: true,
    margin: {left: '1cm', top: '1cm', right: '1cm', bottom: '1cm'}
  });
  await page.goto(MAIN_URL);
  await page.$eval(MENU, e => e.remove());
  await page.$eval(HEADER, e => e.remove());
  await page.pdf({
    path:'PDF/1.pdf',
    format: 'A4',
    printBackground: true,
    margin: {left: '1cm', top: '1cm', right: '1cm', bottom: '1cm'}
  });
  cl.CommentHl("Created preliminar pages [0, 1]");

  links.forEach((e) => {
    if (e !== MAIN_URL && e !== MAIN_URL + '#'){
      pages.push(e);
    }
  });

  // Export to pdf in path: 'PDF/'
  for (let i = 0; i < (pages.length); i++){
    const link = pages[i];
    await page.goto(`${link}`, { waitUntil: 'networkidle0', timeout: 0 });

    // Check for images
    await page.$$eval('img', e => e.map(e => e.removeAttribute("loading")));

    await page.setViewport({
      width: 1900,
      height: 1080,
      deviceScaleFactor: 2,
    });
    await page.pdf({
      path: `PDF/${i + 2}.pdf`,
      format: 'A4',
      printBackground: true,
      margin: {left: '1cm', top: '1cm', right: '1cm', bottom: '1cm'}
    });

    cl.Comment(`Printing page ${i + 2} from ${pages.length + 1}`);
  };

  cl.Success("Pdf generated successfully!");
}

// MAIN
(async () => {
  try {
    await browseWP(URL + "wp-login.php?");
    process.exit(1);
  } catch (error) {
    cl.Warn('Found some errors. ' + error);
    process.exit(-1);
  }
})();
