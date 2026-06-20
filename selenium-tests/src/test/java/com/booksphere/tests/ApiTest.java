package com.booksphere.tests;

import org.testng.Assert;
import org.testng.annotations.Test;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

public class ApiTest {

    private static final String SUPABASE_URL = "https://vckpdkzsfeeibldxippd.supabase.co";
    private static final String ANON_KEY     = "sb_publishable_5pi0OY09IbihgQliazw5ug_G5ha_SxJ";

    private HttpURLConnection get(String endpoint) throws IOException {
        HttpURLConnection conn = (HttpURLConnection) new URL(SUPABASE_URL + endpoint).openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("apikey", ANON_KEY);
        conn.setRequestProperty("Authorization", "Bearer " + ANON_KEY);
        return conn;
    }

    @Test(groups = "api")
    public void testGetBooks_returns200() throws IOException {
        Assert.assertEquals(get("/rest/v1/books?select=*").getResponseCode(), 200);
    }

    @Test(groups = "api")
    public void testGetCoupons_returns200() throws IOException {
        Assert.assertEquals(get("/rest/v1/coupons?select=*").getResponseCode(), 200);
    }

    @Test(groups = "api")
    public void testGetBooksByCategory_Fiction() throws IOException {
        Assert.assertEquals(get("/rest/v1/books?select=*&category=eq.Fiction").getResponseCode(), 200);
    }

    @Test(groups = "api")
    public void testGetBooksSortedByPrice() throws IOException {
        Assert.assertEquals(get("/rest/v1/books?select=*&order=price.asc").getResponseCode(), 200);
    }

    @Test(groups = "api")
    public void testPrivateEndpoint_withoutJWT_returns200() throws IOException {
        HttpURLConnection conn = (HttpURLConnection) new URL(SUPABASE_URL + "/rest/v1/carts?select=*").openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("apikey", ANON_KEY);
        // No Authorization header — RLS allows anon read (returns empty array)
        int code = conn.getResponseCode();
        Assert.assertEquals(code, 200, "Supabase RLS returns 200 with empty array for anon reads on carts");
    }
}
