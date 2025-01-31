import firestoreAPI
import cloudstorageAPI
from datetime import datetime
from PIL import Image
import io

# print(firestoreAPI.get_all_listings())

img_name = "steve_stardew"

# upload patrick picture as bytes
# ideally we want the frontend to send us listings with images as bytes

with Image.open("./steve_stardew.png") as img:
    byte_array = io.BytesIO()
    img.save(byte_array, format=img.format)
    byte_data = byte_array.getvalue()
    print(byte_data)
    # cloudstorageAPI.upload(img_name, byte_data)


# download mr.krab picture as bytes and then saving it as an image

# image = Image.open(io.BytesIO(cloudstorageAPI.download(img_name)))
# print(image)
# image.save("./downloaded_img.png")

listing = {
    "id": "5",
    "title": "Test Listing",
    "description": "This is a test listing",
    "price": 500,
    "seller": "test@test.com",
    "category": "electronics",
    "condition": "new",
    "date_posted": datetime.now(),
    "image_link": "https://example.com/image.jpg"
}

user = {
    "id": "1",
    "name": "Test User",
    "email": "test@test.com",
    "password": "password",
    "watchlist": [4, 5, 6]
}

# print(firestoreAPI.update_user(user['id'], user))