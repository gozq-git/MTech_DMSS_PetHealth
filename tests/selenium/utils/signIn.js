require('dotenv').config()

module.exports = { signIn }

const {By, Key, until} = require('selenium-webdriver');
const assert = require("assert");

const url = process.env.WEBSITE_LINK || "http://localhost:5173";

async function signIn (driver) {
    await driver.get(url);

    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/main/p/div/div[1]/h3')), 5000);
    let welcomeMessage = await driver.findElement(By.xpath('//*[@id="root"]/div/main/p/div/div[1]/h3'));
    assert.equal(await welcomeMessage.getText(), 'Welcome to Pet Health Platform!');

    let accountButton = await driver.findElement(By.xpath('//*[@id="root"]/div/header/div/div/button'));
    await accountButton.click();
    let signInButton = await driver.findElement(By.xpath('/html/body/div[2]/div[3]/ul/li[1]'));
    await signInButton.click();
    await driver.wait(until.elementLocated(By.xpath('//*[@id="loginHeader"]/div')), 5000);
    let signInURL = await driver.getCurrentUrl();
    assert.ok(signInURL.includes('https://testentraphp.ciamlogin.com'));

    let enterEmailTextField = await driver.findElement(By.xpath('//*[@id="i0116"]'));
    await enterEmailTextField.sendKeys("gerardozq@gmail.com", Key.ENTER); 
    await driver.wait(until.elementLocated(By.xpath('//*[@id="i0118"]')), 5000);
    let enterPasswordTextField = await driver.findElement(By.xpath('//*[@id="i0118"]'));
    await enterPasswordTextField.sendKeys("DMSSpass123");
    await driver.sleep(3000);
    await driver.wait(until.elementLocated(By.xpath('//*[@id="lightbox"]/div[3]/div/div[2]/div/div[5]/div/div/div/div')), 5000);
    let entraSignInButton = await driver.findElement(By.xpath('//*[@id="lightbox"]/div[3]/div/div[2]/div/div[5]/div/div/div/div'));
    await entraSignInButton.click();
    await driver.wait(until.elementLocated(By.xpath('//*[@id="lightbox"]/div[3]/div/div[2]/div/div[3]/div[2]/div/div/div[1]')), 5000);
    let staySignedInNoButton = await driver.findElement(By.xpath('//*[@id="lightbox"]/div[3]/div/div[2]/div/div[3]/div[2]/div/div/div[1]'));
    await staySignedInNoButton.click();
    await driver.wait(until.elementLocated(By.xpath('//*[@id="root"]/div/main/p/div/div/div/div/div')), 10000);
    let welcomeBackMessage = await driver.findElement(By.xpath('//*[@id="root"]/div/main/p/div/div/div/div/div'));
    assert.equal(await welcomeBackMessage.getText(), '🐾 Welcome back, Gerard!\n📧 gerardozq@gmail.com');
  }
  
  