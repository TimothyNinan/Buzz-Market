from datetime import datetime

class Listing:
    def __init__(self, id, title, description, price, seller, img, category=None, condition=None, date_posted=None):
        self.id = id
        self.title = title
        self.description = description
        self.price = price
        self.seller = seller
        self.img = img
        self.category = category
        self.condition = condition
        self.date_posted = date_posted or datetime.now()

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'price': self.price,
            'seller': self.seller,
            'img': self.img,
            'category': self.category,
            'condition': self.condition,
            'date_posted': self.date_posted.isoformat()
        }
    
    def update(self, data: dict):
        for key, value in data.items():
            if hasattr(self, key):
                setattr(self, key, value)

    @classmethod
    def from_dict(cls, data):
        return cls(
            id=data['id'],
            title=data['title'],
            description=data['description'],
            price=data['price'],
            seller=data['seller'],
            img=data['img'],
            category=data.get('category'),
            condition=data.get('condition'),
            date_posted=data.get('date_posted')
        )