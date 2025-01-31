from typing import List
from listing import Listing
from werkzeug.security import generate_password_hash, check_password_hash

class User:
    def __init__(self, id: int, name: str, email: str, password: str, watchlist: List[Listing]):
        self.id = id
        self.name = name
        self.email = email
        self.password = password
        self.watchlist = watchlist
    
    def verify_password(self, password):
        return check_password_hash(self.password, password)

    def add_to_watchlist(self, listing: Listing):
        if listing not in self.watchlist:
            self.watchlist.append(listing)

    def remove_from_watchlist(self, listing: Listing):
        if listing in self.watchlist:
            self.watchlist.remove(listing)

    def get_watchlist(self) -> List[Listing]:
        return self.watchlist

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'password': self.password,
            'watchlist': self.watchlist
        }

    @classmethod
    def from_dict(cls, data):
        user = cls(
            id=data['id'],
            name=data['name'],
            email=data['email'],
            password=data['password'],
            watchlist=data.get('watchlist', [])
        )
        return user
