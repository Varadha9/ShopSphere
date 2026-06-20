Feature: User Login — BookSphere

  # TC_L_01
  Scenario: Successful login with valid credentials
    Given I am on the BookSphere login page
    When I enter email "varadmandhare924@gmail.com" and password "Varad@999"
    And I click the login button
    Then I should be redirected away from the login page

  # TC_L_02
  Scenario: Login fails with wrong password
    Given I am on the BookSphere login page
    When I enter email "varadmandhare924@gmail.com" and password "wrongpassword"
    And I click the login button
    Then I should see an error message

  # TC_L_03
  Scenario: Login fails with empty email
    Given I am on the BookSphere login page
    When I enter email "" and password "Varad@999"
    And I click the login button
    Then I should see a field validation error

  # TC_L_04
  Scenario: Login fails with empty password
    Given I am on the BookSphere login page
    When I enter email "varadmandhare924@gmail.com" and password ""
    And I click the login button
    Then I should see a field validation error
