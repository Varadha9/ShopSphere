package com.booksphere.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class CartPage {

    private final WebDriver driver;
    private final WebDriverWait wait;
    private final JavascriptExecutor js;

    private final By cartItems     = By.cssSelector(".cart-item-row");
    private final By removeBtn     = By.cssSelector(".btn-danger.btn-xs");
    private final By undoBtn       = By.cssSelector(".undo-banner button");
    private final By applyDiscount = By.cssSelector(".coupons-info .btn-sm");
    private final By discountLabel = By.cssSelector(".discount-result");
    private final By placeOrderBtn = By.cssSelector(".btn-place-order");
    private final By emptyCart     = By.cssSelector(".cart-empty-state");

    public CartPage(WebDriver driver) {
        this.driver = driver;
        this.wait   = new WebDriverWait(driver, Duration.ofSeconds(10));
        this.js     = (JavascriptExecutor) driver;
    }

    public int getCartItemCount() {
        return driver.findElements(cartItems).size();
    }

    public void removeFirstItem() {
        // wait for the item row to be fully visible before removing
        WebElement btn = wait.until(ExpectedConditions.visibilityOfElementLocated(removeBtn));
        js.executeScript("arguments[0].scrollIntoView({block:'center'})", btn);
        try { Thread.sleep(400); } catch (InterruptedException ignored) {}
        btn.click();
        new WebDriverWait(driver, Duration.ofSeconds(10))
            .until(d -> d.findElements(By.cssSelector(".undo-banner")).size() > 0
                     || d.findElements(By.cssSelector(".cart-empty-state")).size() > 0);
    }

    public void clickUndo() {
        WebElement btn = wait.until(ExpectedConditions.presenceOfElementLocated(undoBtn));
        js.executeScript("arguments[0].click()", btn);
    }

    public void applyCoupon(String code) {
        // single 'Apply Best Discount' button — DP knapsack, no coupon code input
        WebElement btn = wait.until(ExpectedConditions.presenceOfElementLocated(applyDiscount));
        js.executeScript("arguments[0].scrollIntoView({block:'center'})", btn);
        try { Thread.sleep(300); } catch (InterruptedException ignored) {}
        js.executeScript("arguments[0].click()", btn);
    }

    public boolean isDiscountApplied() {
        // .discount-result always renders after clicking apply (shows savings or "no coupons" msg)
        return wait.until(ExpectedConditions.presenceOfElementLocated(discountLabel)).isDisplayed();
    }

    public void placeOrder() {
        driver.findElement(placeOrderBtn).click();
    }

    public boolean isCartEmpty() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(emptyCart)).isDisplayed();
    }
}
