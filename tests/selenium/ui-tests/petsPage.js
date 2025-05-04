const { signIn } = require('../utils/signIn.js');

const {By, Builder, Key, until} = require('selenium-webdriver');
const assert = require("assert");

const chrome = require('selenium-webdriver/chrome');

describe('Pets Page Test', function () {
  let driver;

  before(async function () {
    driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().addArguments("incognito"))
    .build();
  });

  after(async () => await driver.quit());

  it('Check sign in', async function (){await signIn(driver)})

  it('Check Pet Page', async function (){
    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/header/div/button')), 10000);
    let menuButton = await driver.findElement(By.xpath('//*[@id="root"]/div/header/div/button'));
    await menuButton.click();
    let menuPetButton = await driver.findElement(By.xpath('/html/body/div[2]/div[3]/div[2]/ul/li[2]/div'));
    await driver.executeScript("arguments[0].click();", menuPetButton);
    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/main/p/div/div/div[1]/h4')), 5000);
    let petPageTitle = await driver.findElement(By.xpath('//*[@id="root"]/div/main/p/div/div/div[1]/h4'));
    assert.equal(await petPageTitle.getText(), 'My Pets');
  })

  it('Check Add Pet', async function (){
    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/main/p/div/div/div[1]/h4')), 10000);
    let addPetButton = await driver.findElement(By.xpath('//*[@id="root"]/div/main/p/div/div/div[1]/button'));
    await driver.executeScript("arguments[0].click();", addPetButton);
    await driver.wait(until.elementLocated(By.xpath('/html/body/div[2]/div[3]/div/h2')), 5000);
    let addPetTitle = await driver.findElement(By.xpath('/html/body/div[2]/div[3]/div/h2'));
    assert.equal(await addPetTitle.getText(), 'Add New Pet');
  })
  


}
)
