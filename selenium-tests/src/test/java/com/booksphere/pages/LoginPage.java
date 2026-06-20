package com.booksphere.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class LoginPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    // exact selectors from LoginPage.jsx
    private final By emailInput    = By.cssSelector("input[type='email']");
    private final By passwordInput = By.cssSelector("input[type='password']");
    private final By submitBtn     = By.cssSelector("button.lf-submit");
    private final By errorMsg      = By.cssSelector(".lf-error-msg");
    private final By emailErrMsg   = By.cssSelector(".lf-field .lf-err-msg");
    private final By showPassBtn   = By.cssSelector("button.lf-show-pass");
    private final By signUpToggle  = By.xpath("//div[@class='login-toggle']//button[text()='Sign Up']");
    private final By nameField     = By.cssSelector("input[type='text'][placeholder='Your full name']");
    private final By forgotBtn     = By.cssSelector("button.lf-forgot");
    private final By forgotSuccess = By.cssSelector(".lf-status.lf-success");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait   = new WebDriverWait(driver, Duration.ofSeconds(15));
    }

    public void login(String email, String password) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(emailInput)).clear();
        driver.findElement(emailInput).sendKeys(email);
        driver.findElement(passwordInput).sendKeys(password);
        driver.findElement(submitBtn).click();
    }

    public boolean isErrorDisplayed() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(errorMsg)).isDisplayed();
    }

    public boolean isEmailFieldErrorDisplayed() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(emailErrMsg)).isDisplayed();
    }

    public void clickShowPassword() {
        driver.findElement(showPassBtn).click();
    }

    public String getPasswordInputType() {
        return driver.findElement(passwordInput).getAttribute("type");
    }

    public void clickSignUpToggle() {
        driver.findElement(signUpToggle).click();
    }

    public boolean isNameFieldVisible() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(nameField)).isDisplayed();
    }

    public void clickForgotPassword() {
        driver.findElement(forgotBtn).click();
    }

    public boolean isForgotSuccessDisplayed() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(forgotSuccess)).isDisplayed();
    }
}
