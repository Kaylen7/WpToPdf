import fs from 'fs';
import { GetAccessSelectors as C } from './constants';
import * as cl from './colorLog';
import dotenv from 'dotenv';

dotenv.config();

export async function getAccess(page: any, url: string): Promise<void> {
    const userSelector = C.USERNAME_SELECTOR;
    const passSelector = C.PASSWORD_SELECTOR;
    const submitSelector = C.SUBMIT_SELECTOR;
    const user = process.env.USERNAME;
    const pss = process.env.PASSWORD;

    cl.Comment('getAccess() activated.\nAttempting to load into webpage: ' + url);
  try {
    await page.goto(url, { waitUntil: 'networkidle0'});
    cl.CommentHl('Page successfully loaded!');
    process.env.NODE_ENV === 'debug' ? cl.Comment(' I took a screenshot `first_page.png` for debugging purposes.') : null;
    await page.screenshot({path:'first_page.png'});
    cl.Comment('🔐 Now, attempting to log in...');
    await page.waitForSelector(userSelector);
    await page.click(userSelector);
    await page.keyboard.type(user);
    await page.waitForSelector(passSelector);
    await page.click(passSelector);
    await page.keyboard.type(pss);
    await page.waitForSelector(submitSelector);
    await page.click(submitSelector);
    await page.waitForNavigation();
    cl.Success('Access granted!');
    fs.unlinkSync('first_page.png');
    process.env.NODE_ENV === 'debug' ? cl.Comment('Removed first screenshot') : null;
  } catch (error) {
    cl.Warn('Error attempting to access page. Please check the url and credentials.\n' + error);
    process.exit(-1);
  }
};