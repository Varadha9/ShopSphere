package com.booksphere.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

public class CatalogPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    private final By searchInput  = By.cssSelector("input.search-input");
    private final By bookCards    = By.cssSelector(".product-card");
    private final By genreNodes   = By.cssSelector(".tree-node");
    private final By addToCartBtn = By.cssSelector(".product-card .add-to-cart-btn");

    public CatalogPage(WebDriver driver) {
        this.driver = driver;
        this.wait   = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void searchFor(String query) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(searchInput)).clear();
        driver.findElement(searchInput).sendKeys(query);
    }

    public int getBookCardCount() {
        wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(bookCards));
        return driver.findElements(bookCards).size();
    }

    public void addFirstBookToCart() {
        List<?> buttons = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(addToCartBtn));
        driver.findElements(addToCartBtn).get(0).click();
    }

    public boolean isGenreTreeVisible() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(genreNodes)).isDisplayed();
    }
}
