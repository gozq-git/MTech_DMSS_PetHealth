const { signIn } = require('../utils/signIn.js');

const {By, Builder, Key, until} = require('selenium-webdriver');
const assert = require("assert");

const chrome = require('selenium-webdriver/chrome');

describe('Appointments Page Test', function () {
  let driver;

  before(async function () {
    driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().addArguments("incognito"))
    .build();
  });

  after(async () => await driver.quit());

  it('Check sign in', async function (){await signIn(driver)})

  it('Check Appointment Page', async function (){
    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/header/div/button')), 10000);
    let menuButton = await driver.findElement(By.xpath('//*[@id="root"]/div/header/div/button'));
    await menuButton.click();
    let menuHealthcareButton = await driver.findElement(By.xpath('/html/body/div[2]/div[3]/div[2]/ul/li[3]/div'));
    await driver.executeScript("arguments[0].click();", menuHealthcareButton);
    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/main/p/div/div[1]/h4')), 5000);
    let appointmentsPageTitle = await driver.findElement(By.xpath('//*[@id="root"]/div/main/p/div/div[1]/h4'));
    assert.equal(await appointmentsPageTitle.getText(), 'Book an Appointment');
  })

  it('Check Vet Availability', async function (){
    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/main/p/div/div[1]/h4')), 10000);
    let calendarButton = await driver.findElement(By.xpath('//*[@id="root"]/div/main/p/div/div[1]/div[1]/div[2]/div/table/tbody/tr/td/div/div/div/table/tbody/tr[3]/td[4]'));
    await driver.executeScript("arguments[0].click();", calendarButton);
    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/main/p/div/div[1]/h6')), 5000);
    let vetAvailabilityDisplay = await driver.findElement(By.xpath('//*[@id="root"]/div/main/p/div/div[1]/h6'));
    assert.equal(await vetAvailabilityDisplay.getText(), 'Available Vets on —');
  })

}
)
