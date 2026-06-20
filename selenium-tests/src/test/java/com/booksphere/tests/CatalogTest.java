package com.booksphere.tests;

import com.booksphere.pages.CatalogPage;
import com.booksphere.pages.LoginPage;
import com.booksphere.utils.BaseTest;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.Duration;

public class CatalogTest extends BaseTest {

    @BeforeMethod(alwaysRun = true)
    public void loginFirst() {
        new LoginPage(driver).login("varadmandhare924@gmail.com", "Varad@999");
        // SPA — catalog loads at root after login, no URL routing
        new WebDriverWait(driver, Duration.ofSeconds(20))
            .until(ExpectedConditions.presenceOfElementLocated(
                org.openqa.selenium.By.cssSelector(".product-card")));
    }

    @Test(groups = "regression")
    public void testBooksLoadOnCatalog() {
        CatalogPage catalog = new CatalogPage(driver);
        Assert.assertTrue(catalog.getBookCardCount() > 0, "Catalog should show books");
    }

    @Test(groups = "regression")
    public void testSearchFiltersBooks() {
        CatalogPage catalog = new CatalogPage(driver);
        catalog.searchFor("Atomic");
        // wait briefly for React to re-render search results
        try { Thread.sleep(1500); } catch (InterruptedException ignored) {}
        int filtered = catalog.getBookCardCount();
        Assert.assertTrue(filtered > 0, "Search for 'Atomic' should return at least one result");
        Assert.assertTrue(filtered <= 12, "Search should not return more than total catalog");
    }

    @Test(groups = "regression")
    public void testGenreTreeVisible() {
        Assert.assertTrue(new CatalogPage(driver).isGenreTreeVisible(), "Genre tree should be visible");
    }
}
