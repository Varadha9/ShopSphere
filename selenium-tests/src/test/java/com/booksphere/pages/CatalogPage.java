package com.booksphere.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class CatalogPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    private final By searchInput  = By.cssSelector(".hero-search input, .search-bar input");
    private final By bookCards    = By.cssSelector(".product-card");
    private final By genreNodes   = By.cssSelector(".cat-tree");
    private final By addToCartBtn = By.cssSelector(".product-card .btn-primary");

    public CatalogPage(WebDriver driver) {
        this.driver = driver;
        this.wait   = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void searchFor(String query) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(searchInput)).clear();
        driver.findElement(searchInput).sendKeys(query);
        driver.findElement(searchInput).sendKeys(org.openqa.selenium.Keys.RETURN);
    }

    public int getBookCardCount() {
        wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(bookCards));
        return driver.findElements(bookCards).size();
    }

    public void addFirstBookToCart() {
        wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(addToCartBtn));
        // scroll product grid into view to clear sticky headers / sliders
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("document.querySelector('.product-grid')?.scrollIntoView({block:'start'})");
        try { Thread.sleep(700); } catch (InterruptedException ignored) {}
        org.openqa.selenium.WebElement btn = driver.findElements(addToCartBtn).get(0);
        js.executeScript("arguments[0].scrollIntoView({block:'center'})", btn);
        try { Thread.sleep(400); } catch (InterruptedException ignored) {}
        js.executeScript("arguments[0].click()", btn);
        // wait for toast confirming the item was added
        new WebDriverWait(driver, Duration.ofSeconds(10))
            .until(ExpectedConditions.presenceOfElementLocated(By.cssSelector(".toast")));
    }

    public boolean isGenreTreeVisible() {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(genreNodes)).isDisplayed();
    }
}
