package com.booksphere.tests;

import com.booksphere.pages.LoginPage;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.en.*;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

import java.time.Duration;

public class LoginStepDefs {

    private WebDriver driver;
    private String pendingEmail;
    private String pendingPassword;

    @Before
    public void setup() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
    }

    @Given("I am on the BookSphere login page")
    public void openLoginPage() {
        driver.get("https://booksphere-dun.vercel.app");
    }

    @When("I enter email {string} and password {string}")
    public void storeCredentials(String email, String password) {
        pendingEmail    = email;
        pendingPassword = password;
    }

    @And("I click the login button")
    public void clickLogin() {
        new LoginPage(driver).login(pendingEmail, pendingPassword);
    }

    @Then("I should be redirected away from the login page")
    public void assertRedirected() {
        new WebDriverWait(driver, Duration.ofSeconds(15))
            .until(ExpectedConditions.not(ExpectedConditions.urlContains("/login")));
        Assert.assertFalse(driver.getCurrentUrl().contains("/login"));
    }

    @Then("I should see an error message")
    public void assertError() {
        Assert.assertTrue(new LoginPage(driver).isErrorDisplayed());
    }

    @Then("I should see a field validation error")
    public void assertFieldError() {
        // Either lf-err-msg (inline) or lf-error-msg (auth error) is acceptable
        Assert.assertTrue(
            new LoginPage(driver).isEmailFieldErrorDisplayed() ||
            new LoginPage(driver).isErrorDisplayed(),
            "A validation error should be displayed"
        );
    }

    @After
    public void teardown() {
        if (driver != null) driver.quit();
    }
}
