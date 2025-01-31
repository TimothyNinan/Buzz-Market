from listing import Listing
from datetime import datetime

class ListingFactory:
    @staticmethod
    def create_listing(id, title, description, price, seller, img, category=None, condition=None, date_posted=None):
        """
        Creates and returns a new Listing object.
        
        :param id: Unique identifier for the listing
        :param title: Title of the listing
        :param description: Description of the item
        :param price: Price of the item
        :param seller: Seller of the item
        :param category: Optional category of the item
        :param condition: Optional condition of the item
        :param date_posted: Optional date when the listing was posted
        :return: A new Listing object
        """
        return Listing(
            id=id,
            title=title,
            description=description,
            price=price,
            seller=seller,
            img=img,
            category=category,
            condition=condition,
            date_posted=date_posted or datetime.now()
        )

    @staticmethod
    def create_listing_from_dict(data):
        """
        Creates and returns a new Listing object from a dictionary.
        
        :param data: Dictionary containing listing data
        :return: A new Listing object
        """
        return Listing.from_dict(data)
