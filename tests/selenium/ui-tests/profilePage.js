const { signIn } = require('../utils/signIn.js');

const {By, Builder, Key, until} = require('selenium-webdriver');
const assert = require("assert");

const chrome = require('selenium-webdriver/chrome');

describe('Profile Page Test', function () {
  let driver;

  before(async function () {
    driver = await new Builder()
    .forBrowser('chrome')
    .usingServer(process.env.SELENIUM_REMOTE_URL)
    .setChromeOptions(new chrome.Options().addArguments("incognito"))
    .build();
  });

  after(async () => await driver.quit());

  it('Check sign in', async function (){await signIn(driver)})

  it('Check Profile Page', async function (){
    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/header/div/div/button')), 10000);
    let accountButton = await driver.findElement(By.xpath('//*[@id="root"]/div/header/div/div/button[2]'));
    await accountButton.click();
    let profileButton = await driver.findElement(By.xpath('/html/body/div[2]/div[3]/ul/li[1]'));
    await driver.executeScript("arguments[0].click();", profileButton);
    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/main/p/div/div/h4')), 5000);
    let profileTitle = await driver.findElement(By.xpath('//*[@id="root"]/div/main/p/div/div/h4'));
    assert.equal(await profileTitle.getText(), 'Update Profile');
  })
}
)