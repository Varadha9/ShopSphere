package com.booksphere.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class CartPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    private final By cartItems     = By.cssSelector(".cart-item");
    private final By removeBtn     = By.cssSelector(".cart-item .remove-btn");
    private final By undoBtn       = By.cssSelector(".undo-btn");
    private final By couponInput   = By.cssSelector("input.coupon-input");
    private final By applyCoupon   = By.cssSelector(".apply-coupon-btn");
    private final By discountLabel = By.cssSelector(".discount-value");
    private final By placeOrderBtn = By.cssSelector(".place-order-btn");
    private final By emptyCart     = By.cssSelector(".empty-cart");

    public CartPage(WebDriver driver) {
        this.driver = driver;
        this.wait   = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public int getCartItemCount() {
        return driver.findElements(cartItems).size();
    }

    public void removeFirstItem() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(removeBtn)).click();
    }

    public void clickUndo() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(undoBtn)).click();
    }

    public void applyCoupon(String code) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(couponInput)).sendKeys(code);
        driver.findElement(applyCoupon).click();
    }

    public boolean isDiscountApplied() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(discountLabel)).isDisplayed();
    }

    public void placeOrder() {
        driver.findElement(placeOrderBtn).click();
    }

    public boolean isCartEmpty() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(emptyCart)).isDisplayed();
    }
}
