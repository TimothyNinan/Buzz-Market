# use pytest command to test
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
#from selenium.webdriver.support.ui import WebDriverWait
#from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options

import time
import pytest

@pytest.fixture(scope="function")
def driver():
    # Set up Chrome options
    chrome_options = Options()
    chrome_options.add_argument('--headless')  # Run headless if you don't need a GUI
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument("--window-size=1920,1080")

    # Set up the Chrome driver
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)

    yield driver

    # Quit the driver after each test
    driver.quit()

# tests login and logout
def test_login(driver):
    # Navigate to the landing page
    driver.get('http://localhost:5173/')
    
    # Find the email field and enter the email
    email_field = driver.find_element(By.NAME, "email")
    email_field.clear()
    email_field.send_keys('jjones634@gatech.edu')
    
    # Find the password field and enter the password
    password_field = driver.find_element(By.NAME, "password")
    password_field.clear()
    password_field.send_keys('pass')

    # Find the login button and click it
    login_button = driver.find_element(By.CLASS_NAME, 'login-button')
    login_button.click()

    # Wait for a short duration to give the page time to load
    time.sleep(5)
    
    # Verify the URL has changed to the home page
    assert driver.current_url == 'http://localhost:5173/home', "Failed to log in or incorrect redirection."

    logout_button = driver.find_element(By.NAME, 'logout-button')
    logout_button.click()

    time.sleep(5)
    assert driver.current_url == 'http://localhost:5173/', "Failed to log out or incorrect redirection."


# tests signup
def test_signup(driver):
    # Navigate to the landing page
    driver.get('http://localhost:5173/')

    # Find the signup button and click it
    signup_button = driver.find_element(By.CLASS_NAME, 'signup-button')
    signup_button.click()

    # Wait for a short duration to give the page time to load
    time.sleep(5)

    # Verify some expected change after signup; adjust as needed
    assert driver.current_url == 'http://localhost:5173/signup', "Failed to sign up or incorrect redirection."

    # now signup page should be displayed
    email_field = driver.find_element(By.NAME, "email")
    email_field.clear()
    email_field.send_keys('test13@test.edu')

    username_field = driver.find_element(By.NAME, "name")
    username_field.clear()
    username_field.send_keys('test8')

    password_field = driver.find_element(By.NAME, "password")
    password_field.clear()
    password_field.send_keys('password')

    signupcomplete_button = driver.find_element(By.CLASS_NAME, 'signup-button')
    signupcomplete_button.click()
    #for some reason, goes to landing page instead of home page??

    time.sleep(5)
    
    # Verify some expected change after signup; adjust as needed
    assert driver.current_url == 'http://localhost:5173/home', "Failed to sign up or incorrect redirection."

# tests searching listings
def test_searching(driver):
    # Navigate to the landing page
    driver.get('http://localhost:5173/')
    
    # Find the email field and enter the email
    email_field = driver.find_element(By.NAME, "email")
    email_field.clear()
    email_field.send_keys('jjones634@gatech.edu')
    
    # Find the password field and enter the password
    password_field = driver.find_element(By.NAME, "password")
    password_field.clear()
    password_field.send_keys('pass')

    # Find the login button and click it
    login_button = driver.find_element(By.CLASS_NAME, 'login-button')
    login_button.click()

    # Wait for a short duration to give the page time to load
    time.sleep(5)
    
    # Verify the URL has changed to the home page
    assert driver.current_url == 'http://localhost:5173/home', "Failed to log in or incorrect redirection."

    #searching
    search_field = driver.find_element(By.CLASS_NAME, "form-control")
    search_field.clear()
    search_field.send_keys('Buzzzzz')

    search_button = driver.find_element(By.NAME, 'search-button')
    search_button.click()

    # Wait for the search results to load
    time.sleep(5)

    # Verify a listing with the title 'Buzzzzz' appears in the results
    item_title = driver.find_element(By.XPATH, "//h5[text()='Buzzzzz']")
    assert item_title is not None, "The listing titled 'Buzzzzz' was not found in the search results."

    # Click on the item to navigate to its page
    item_title.click()

    # Wait for navigation
    time.sleep(5)

    # Verify the URL has changed to the item's page, it has an id 10
    expected_url_contains = "/item/10"
    assert expected_url_contains in driver.current_url, f"Failed to navigate to the item's page. Current URL: {driver.current_url}"

def test_watchlist(driver):
    # Navigate to the landing page
    driver.get('http://localhost:5173/')
    
    # Find the email field and enter the email
    email_field = driver.find_element(By.NAME, "email")
    email_field.clear()
    email_field.send_keys('jjones634@gatech.edu')
    
    # Find the password field and enter the password
    password_field = driver.find_element(By.NAME, "password")
    password_field.clear()
    password_field.send_keys('pass')

    # Find the login button and click it
    login_button = driver.find_element(By.CLASS_NAME, 'login-button')
    login_button.click()

    # Wait for a short duration to give the page time to load
    time.sleep(5)
    
    # Verify the URL has changed to the home page
    assert driver.current_url == 'http://localhost:5173/home', "Failed to log in or incorrect redirection."

    #watchlist
    watchlist_button = driver.find_element(By.NAME, "watchlist-button")
    watchlist_button.click()

    # Wait for navigation to the watchlist page
    time.sleep(5)

    # Verify navigation to the watchlist page
    assert driver.current_url == 'http://localhost:5173/watchlist', "Failed to navigate to the watchlist page."

    # Check for the presence of a watchlist item with the title "Krabby Patty"
    watchlist_item = driver.find_element(By.XPATH, "//h3[text()='Krabby Patty']")
    assert watchlist_item is not None, "The watchlist item titled 'Krabby Patty' was not found."