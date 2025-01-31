import threading
from typing import Dict, List
from listing import Listing
from user import User  # Assuming there's a User class defined elsewhere

class Storage:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(Storage, cls).__new__(cls)
                    cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        self._listings: Dict[int, Listing] = {}
        self._users: Dict[int, User] = {}

    def add_listing(self, listing: Listing):
        self._listings[listing.id] = listing

    def get_listing(self, listing_id: int) -> Listing:
        return self._listings.get(listing_id)

    def remove_listing(self, listing_id: int):
        self._listings.pop(listing_id, None)

    def update_listing(self, listing_id: int, data: dict):
        listing = self._listings.get(listing_id)
        if listing:
            listing.update(data)

    def get_all_listings(self) -> List[Listing]:
        return list(self._listings.values())

    def add_user(self, user: User):
        self._users[user.id] = user

    def get_user(self, user_id: int) -> User:
        return self._users.get(user_id)

    def remove_user(self, user_id: int):
        self._users.pop(user_id, None)

    def get_all_users(self) -> List[User]:
        return list(self._users.values())
