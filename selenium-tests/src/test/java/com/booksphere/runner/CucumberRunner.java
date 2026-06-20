package com.booksphere.runner;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;

@CucumberOptions(
    features = "src/test/resources/features",
    glue     = "com.booksphere.tests",
    plugin   = { "pretty", "html:target/cucumber-report.html" }
)
public class CucumberRunner extends AbstractTestNGCucumberTests {
}
