package com.booksphere.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class OrdersPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    private final By orderCards   = By.cssSelector(".order-card");
    private final By premiumBadge = By.cssSelector(".premium-badge");
    private final By pendingStatus = By.cssSelector(".status-pending");

    public OrdersPage(WebDriver driver) {
        this.driver = driver;
        this.wait   = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public int getOrderCount() {
        wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(orderCards));
        return driver.findElements(orderCards).size();
    }

    public boolean isPremiumOrderFirst() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(premiumBadge)).isDisplayed();
    }

    public boolean hasOrderWithStatus(String status) {
        return !driver.findElements(By.cssSelector(".status-" + status.toLowerCase())).isEmpty();
    }
}
