const { signIn } = require('../utils/signIn.js');

const {By, Builder, Key, until} = require('selenium-webdriver');
const assert = require("assert");

const chrome = require('selenium-webdriver/chrome');

describe('Teleconsultation Page Test', function () {
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

  it('Check Teleconsultation Page', async function (){
    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/header/div/button')), 10000);
    let menuButton = await driver.findElement(By.xpath('//*[@id="root"]/div/header/div/button'));
    await menuButton.click();
    let menuTeleconsultationButton = await driver.findElement(By.xpath('/html/body/div[2]/div[3]/div[2]/ul/li[4]/div'));
    await driver.executeScript("arguments[0].click();", menuTeleconsultationButton);
    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/main/p/div/div/div[1]/h1')), 5000);
    let teleconsultationPageTitle = await driver.findElement(By.xpath('//*[@id="root"]/div/main/p/div/div/div[1]/h1'));
    assert.equal(await teleconsultationPageTitle.getText(), 'Vet Teleconsultation Service');
  })

}
)
