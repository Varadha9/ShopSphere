package com.booksphere.tests;

import com.booksphere.pages.CartPage;
import com.booksphere.pages.CatalogPage;
import com.booksphere.pages.LoginPage;
import com.booksphere.utils.BaseTest;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.time.Duration;

public class CartTest extends BaseTest {

    @BeforeMethod(alwaysRun = true)
    public void loginAndAddBook() {
        super.setup();
        new LoginPage(driver).login("varadmandhare924@gmail.com", "Varad@999");
        new WebDriverWait(driver, Duration.ofSeconds(10))
            .until(ExpectedConditions.urlContains("/catalog"));

        CatalogPage catalog = new CatalogPage(driver);
        catalog.addFirstBookToCart();

        driver.get(BaseTest.BASE_URL + "/cart");
    }

    @Test(groups = "regression")
    public void testBookAddedToCart() {
        Assert.assertTrue(new CartPage(driver).getCartItemCount() > 0, "Cart should have at least one item");
    }

    @Test(groups = "regression")
    public void testUndoRemove() {
        CartPage cart = new CartPage(driver);
        int before = cart.getCartItemCount();

        cart.removeFirstItem();
        cart.clickUndo();

        int after = cart.getCartItemCount();
        Assert.assertEquals(after, before, "Undo should restore removed item");
    }

    @Test(groups = "regression")
    public void testCouponApplied() {
        CartPage cart = new CartPage(driver);
        cart.applyCoupon("BOOK30");
        Assert.assertTrue(cart.isDiscountApplied(), "Discount should show after applying coupon");
    }
}
