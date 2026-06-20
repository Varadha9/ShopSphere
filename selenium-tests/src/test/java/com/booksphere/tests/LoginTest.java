package com.booksphere.tests;

import com.booksphere.pages.LoginPage;
import com.booksphere.utils.BaseTest;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.time.Duration;

public class LoginTest extends BaseTest {

    private static final String EMAIL = "varadmandhare924@gmail.com";
    private static final String PASS  = "Varad@999";

    // TC_L_01 — valid login
    @Test(groups = "smoke", description = "TC_L_01: Valid email + password login")
    public void testValidLogin() {
        new LoginPage(driver).login(EMAIL, PASS);
        // SPA — after login the catalog renders at root (login form disappears)
        new WebDriverWait(driver, Duration.ofSeconds(20))
            .until(ExpectedConditions.presenceOfElementLocated(
                org.openqa.selenium.By.cssSelector(".product-card")));
        Assert.assertTrue(driver.findElements(
            org.openqa.selenium.By.cssSelector(".product-card")).size() > 0,
            "Catalog should be visible after valid login");
    }

    // TC_L_02 — wrong password
    @Test(groups = "regression", description = "TC_L_02: Wrong password shows lf-error-msg")
    public void testWrongPassword() {
        new LoginPage(driver).login(EMAIL, "wrongpassword");
        Assert.assertTrue(new LoginPage(driver).isErrorDisplayed(),
            "Error message should appear for wrong password");
    }

    // TC_L_03 — empty email
    @Test(groups = "regression", description = "TC_L_03: Empty email shows inline validation")
    public void testEmptyEmail() {
        LoginPage lp = new LoginPage(driver);
        lp.login("", PASS);
        Assert.assertTrue(lp.isEmailFieldErrorDisplayed(),
            "'Enter a valid email' should appear for empty email");
    }

    // TC_L_04 — empty password (data-driven alongside TC_L_03)
    @DataProvider(name = "invalidCreds")
    public Object[][] invalidCreds() {
        return new Object[][] {
            { "",     PASS,          "empty email"    },
            { EMAIL,  "",            "empty password" },
            { "notanemail", PASS,    "invalid format" },
        };
    }

    // TC_L_04 + TC_L_05 — data-driven invalid inputs
    @Test(dataProvider = "invalidCreds", groups = "regression",
          description = "TC_L_04/05: Invalid inputs show inline errors")
    public void testInvalidInputs(String email, String password, String scenario) {
        LoginPage lp = new LoginPage(driver);
        lp.login(email, password);
        // page should NOT navigate away — still on login or error shown
        boolean staysOnLogin = driver.getCurrentUrl().contains("booksphere") &&
            !driver.getPageSource().contains("catalog");
        Assert.assertTrue(staysOnLogin,
            "Should stay on login for scenario: " + scenario);
    }

    // TC_L_06 — password show/hide toggle
    @Test(groups = "regression", description = "TC_L_06: Password toggle show/hide")
    public void testPasswordToggle() {
        LoginPage lp = new LoginPage(driver);
        // type password first so field is active
        new org.openqa.selenium.support.ui.WebDriverWait(driver, Duration.ofSeconds(10))
            .until(ExpectedConditions.visibilityOfElementLocated(
                org.openqa.selenium.By.cssSelector("input[type='password']")))
            .sendKeys(PASS);

        Assert.assertEquals(lp.getPasswordInputType(), "password", "Should be masked initially");
        lp.clickShowPassword();
        Assert.assertEquals(lp.getPasswordInputType(), "text", "Should show password after toggle");
        lp.clickShowPassword();
        Assert.assertEquals(lp.getPasswordInputType(), "password", "Should mask again");
    }

    // TC_L_07 — switch to Sign Up mode
    @Test(groups = "regression", description = "TC_L_07: Switch to Sign Up shows Name field")
    public void testSwitchToSignUp() {
        LoginPage lp = new LoginPage(driver);
        lp.clickSignUpToggle();
        Assert.assertTrue(lp.isNameFieldVisible(), "Full Name field should appear in Sign Up mode");
    }

    // TC_L_08 — forgot password
    @Test(groups = "regression", description = "TC_L_08: Forgot password sends reset email")
    public void testForgotPassword() {
        LoginPage lp = new LoginPage(driver);
        // pre-fill email so the forgot flow works
        driver.findElement(org.openqa.selenium.By.cssSelector("input[type='email']")).sendKeys(EMAIL);
        lp.clickForgotPassword();
        Assert.assertTrue(lp.isForgotSuccessDisplayed(),
            "Success message should show after forgot password");
    }
}
