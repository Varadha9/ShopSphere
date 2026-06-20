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
        super.setup();
        new LoginPage(driver).login("varadmandhare924@gmail.com", "Varad@999");
        new WebDriverWait(driver, Duration.ofSeconds(10))
            .until(ExpectedConditions.urlContains("/catalog"));
    }

    @Test(groups = "regression")
    public void testBooksLoadOnCatalog() {
        CatalogPage catalog = new CatalogPage(driver);
        Assert.assertTrue(catalog.getBookCardCount() > 0, "Catalog should show books");
    }

    @Test(groups = "regression")
    public void testSearchFiltersBooks() {
        CatalogPage catalog = new CatalogPage(driver);
        int totalBooks = catalog.getBookCardCount();

        catalog.searchFor("Atomic");
        int filtered = catalog.getBookCardCount();

        Assert.assertTrue(filtered < totalBooks, "Search should reduce visible books");
        Assert.assertTrue(filtered > 0, "Search should return at least one result");
    }

    @Test(groups = "regression")
    public void testGenreTreeVisible() {
        Assert.assertTrue(new CatalogPage(driver).isGenreTreeVisible(), "Genre tree should be visible");
    }
}
