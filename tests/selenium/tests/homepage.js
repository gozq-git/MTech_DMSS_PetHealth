require('dotenv').config()

const {By, Builder, until} = require('selenium-webdriver');
const assert = require("assert");
const { sign } = require('crypto');

const url = process.env.WEBSITE_LINK;

describe('Homepage Test', function () {
  let driver;

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => await driver.quit());

  it('Check landing page', async function () {
    await driver.get(url);

    await driver.manage().setTimeouts({implicit: 500});

    let welcomeMessage = await driver.findElement(By.xpath('//*[@id="welcome-message"]'));
    assert.equal(await welcomeMessage.getText(), 'Welcome to Pet Health Platform!');
  });

  it('Check navigation to Entra sign in', async function () {
    await driver.get(url);

    let accountButton = await driver.findElement(By.xpath('//*[@id="root"]/div/header/div/div/button'));
    await accountButton.click();
    let signInButton = await driver.findElement(By.xpath('/html/body/div[2]/div[3]/ul/li[1]'));
    await signInButton.click();
    await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath('//*[@id="loginHeader"]/div'))), 5000);
    let signInURL = await driver.getCurrentUrl();
    assert.ok(signInURL.includes('https://testentraphp.ciamlogin.com'))

  });

});