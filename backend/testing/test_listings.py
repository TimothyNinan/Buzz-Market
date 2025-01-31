########################################################
# To Run Just These Tests                              #
# In Backend Directory in Virtual Environment:         #
# pytest testing/test_listings.py                       #
########################################################
# To Run All Tests                                     #
# In Backend Directory in Virtual Environment:         #
# pytest                                               #
########################################################


from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from webdriver_manager.firefox import GeckoDriverManager
from selenium.webdriver.common.by import By
import time
import random
# Set up Firefox options
firefox_options = webdriver.FirefoxOptions()
#firefox_options.add_argument('--headless')
#firefox_options.add_argument('--no-sandbox')
#firefox_options.add_argument('--disable-dev-shm-usage')

# Set up the Firefox driver
service = Service(GeckoDriverManager().install())
driver = webdriver.Firefox(service=service, options=firefox_options)

def test_view_listings():
    driver.get('http://localhost:5173/home')

    # Login 
    email_field = driver.find_element(By.NAME, "email")
    email_field.clear()
    email_field.send_keys('TesterA@test.com')

    password_field = driver.find_element(By.NAME, "password")
    password_field.clear()
    password_field.send_keys('TesterA')

    login_button = driver.find_element(By.CLASS_NAME, "login-button")
    login_button.click()

    time.sleep(4)
    
    listingsHolder = driver.find_element(By.NAME, "listingsHolder")
    
    assert len(listingsHolder.find_elements(By.TAG_NAME, "div")) > 0

    # Find all cards
    cards = driver.find_elements(By.CLASS_NAME, "card-title")
    
    # Check each card has a non-empty title
    for card in cards:
        assert card.text.strip() != "", "Found a card with empty title"

    # Logout
    logout_button = driver.find_element(By.NAME, "logout-button")
    logout_button.click()

    time.sleep(1)
    
    #driver.quit()

def test_create_listing():
    time.sleep(3)
    driver.get('http://localhost:5173/')

    time.sleep(1)

    # Login
    email_field = driver.find_element(By.NAME, "email")
    email_field.clear()
    email_field.send_keys('TesterA@test.com')

    password_field = driver.find_element(By.NAME, "password")
    password_field.clear()
    password_field.send_keys('TesterA')

    login_button = driver.find_element(By.CLASS_NAME, "login-button")
    login_button.click()

    time.sleep(1)

    # Create Listing
    create_listing_button = driver.find_element(By.NAME, "createListingButton")
    create_listing_button.click()

    time.sleep(1)

    random_number = random.randint(1, 100)

    # Fill out form
    title_field = driver.find_element(By.ID, "title")
    title_field.clear()
    title_field.send_keys("Branded TShirts " + str(random_number))

    description_field = driver.find_element(By.ID, "description")
    description_field.clear()
    description_field.send_keys("These are some branded t-shirts that I am selling. They are brand new with tags still on them.")

    price_field = driver.find_element(By.ID, "price")
    price_field.clear()
    price_field.send_keys("10")

    category_field = driver.find_element(By.ID, "category")
    category_field.send_keys("clothing")

    condition_field = driver.find_element(By.ID, "condition")
    condition_field.send_keys("new")

    image_field = driver.find_element(By.ID, "image")
    upload = "/Users/tninan/Documents/personal/cs3300proj2group11/backend/testing/images/tshirts.png"
    image_field.send_keys(upload)

    submit_button = driver.find_element(By.NAME, "submit-button")
    submit_button.click()

    time.sleep(1)

    # Check if listing was created
    h1 = driver.find_element(By.TAG_NAME, "h1")
    assert h1.text.strip() == "Branded TShirts " + str(random_number)

    back_button = driver.find_element(By.NAME, "back-button")
    back_button.click()

    time.sleep(1)


    # Logout
    logout_button = driver.find_element(By.NAME, "logout-button")
    logout_button.click()

    time.sleep(1)
    

def test_view_listing():
    time.sleep(3)
    driver.get('http://localhost:5173/')

    # Login
    email_field = driver.find_element(By.NAME, "email")
    email_field.clear()
    email_field.send_keys('TesterA@test.com')

    password_field = driver.find_element(By.NAME, "password")
    password_field.clear()
    password_field.send_keys('TesterA')

    login_button = driver.find_element(By.CLASS_NAME, "login-button")
    login_button.click()

    time.sleep(4)

    # View Listing
    # Get all listing cards
    cards = driver.find_elements(By.CLASS_NAME, "card")
    
    # Select a random card (excluding the last one which is the create listing button)
    random_card = random.choice(cards[:-1])
    
    # Find and click the card title within the selected card
    card_title = random_card.find_element(By.CLASS_NAME, "card-title")
    title_text = card_title.text
    driver.execute_script("arguments[0].click();", card_title)

    time.sleep(1)

    # Verify the listing title on item page
    item_title = driver.find_element(By.TAG_NAME, "h1")
    assert item_title.text == title_text

    back_button = driver.find_element(By.NAME, "back-button")
    back_button.click()

    time.sleep(1)

    # Logout
    logout_button = driver.find_element(By.NAME, "logout-button")
    logout_button.click()

    time.sleep(1)

    driver.quit()