import firebase_admin
from firebase_admin import credentials, firestore
import cloudstorageAPI

class FirestoreSingleton:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(FirestoreSingleton, cls).__new__(cls, *args, **kwargs)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        # Initialize Firestore DB
        cred = credentials.Certificate('./keys/buzz-market-440617-6f1d1c2dd4a8.json')
        firebase_admin.initialize_app(cred)
        self.db = firestore.client()

    def get_users_collection(self):
        return self.db.collection('users')

    def get_listings_collection(self):
        return self.db.collection('listings')

# Usage
firestore_singleton = FirestoreSingleton()
users = firestore_singleton.get_users_collection()
listings = firestore_singleton.get_listings_collection()
chats = firestore_singleton.db.collection('chats')


################################################################################
# Listing Functions                                                            #
################################################################################

def get_all_listings():
    """
    Retrieves all listings from Firestore database
    """
    docs = listings.stream()
    my_listings = [doc.to_dict() for doc in docs]

    for listing in my_listings:
        listing_id = listing.get('id')
        seller = listing.get('seller')

        if listing_id and seller:
            img_key = f"{seller}-{listing_id}"
            try:
                imgdata = cloudstorageAPI.download(img_key)
                if isinstance(imgdata, bytes):
                    imgdata = imgdata.decode('utf-8')
                listing['img'] = imgdata
            except Exception as e:
                print(f"Failed to download image for listing {listing_id}: {e}")
                listing['img'] = "EMPTY" 
        else:
            listing['img'] = "EMPTY"

    return my_listings
    
def get_watchlist(email):
    query = users.where('email', '==', email).stream()

    for doc in query:
        if doc.exists:
            user_data = doc.to_dict()
            watchlist = user_data.get('watchlist', [])
            print(watchlist)
            return watchlist

    return []

def update_watchlist(req):
    email = req.get('email')
    operation = req.get('op')  # 0 for add, 1 for remove
    listing_id = req.get('lid')

    if email is None or listing_id is None:
        print('Invalid request: Missing email or listing ID')
        return []

    query = users.where('email', '==', email).stream()

    updated_watchlist = []

    for doc in query:
        if doc.exists:
            user_data = doc.to_dict()
            watchlist = user_data.get('watchlist', [])

            if operation == 0:  # Add listing
                if listing_id not in watchlist:
                    watchlist.append(listing_id)
                    print(f"Adding {listing_id} to {email}'s watchlist.")
            elif operation == 1:  # Remove listing
                if listing_id in watchlist:
                    watchlist.remove(listing_id)
                    print(f"Removing {listing_id} to {email}'s watchlist.")
            else:
                print('Invalid operation. Use 0 for add, 1 for remove.')

            doc.reference.update({'watchlist': watchlist})
            updated_watchlist = watchlist

    return updated_watchlist

def number_of_listings():
    """
    Returns the number of listings in Firestore database
    """
    return sum(1 for _ in listings.stream())

def get_listing_by_id(listing_id):
    """
    Retrieves a listing by its ID from Firestore database
    """
    doc = listings.document(str(listing_id)).get()
    my_listing = doc.to_dict() if doc.exists else None

    cupcake = my_listing.get('id')
    seller = my_listing.get('seller')

    if cupcake and seller:
        img_key = f"{seller}-{cupcake}"
        try:
            imgdata = cloudstorageAPI.download(img_key)
            if isinstance(imgdata, bytes):
                imgdata = imgdata.decode('utf-8')
            my_listing['img'] = imgdata
        except Exception as e:
            print(f"Failed to download image for listing {listing_id}: {e}")
            my_listing['img'] = "EMPTY" 
    else:
        my_listing['img'] = "EMPTY"
    
    return my_listing

def get_listings_by_user_id(user_id):
    """
    Gets all listings from a user from Firestore database
    """
    query = listings.where('seller', '==', user_id).stream()
    user_listings = [doc.to_dict() for doc in query]

    for listing in user_listings:
        listing_id = listing.get('id')
        seller = listing.get('seller')

        if listing_id and seller:
            img_key = f"{seller}-{listing_id}"
            try:
                imgdata = cloudstorageAPI.download(img_key)
                if isinstance(imgdata, bytes):
                    imgdata = imgdata.decode('utf-8')
                listing['img'] = imgdata
            except Exception as e:
                print(f"Failed to download image for listing {listing_id}: {e}")
                listing['img'] = "EMPTY"
        else:
            listing['img'] = "EMPTY"

    return user_listings


def create_listing(listing):
    """
    Creates a new listing in Firestore database
    """
    docref = listings.document(str(listing['id']))

    imgFile = f"{str(listing['seller'])}-{str(listing['id'])}"
    cloudstorageAPI.upload(imgFile, listing['img'])

    # make sure to not include imgEncoding into firestore since the file is so humongous
    listing['img'] = imgFile
    docref.set(listing)

    return docref.id

def update_listing(listing_id, listing):
    """
    Updates an existing listing in Firestore database
    """
    imgFile = f"{str(listing['seller'])}-{str(listing['id'])}"

    # simply overwrite existing data in bucket
    cloudstorageAPI.upload(imgFile, listing['img'])

    listing['img'] = imgFile
    listings.document(listing_id).update(listing)
    return listing

def delete_listing(listing_id):
    """
    Deletes an existing listing from Firestore database
    """
    listings.document(listing_id).delete()

def delete_all_listings():
    """
    Deletes all listings from Firestore database
    """
    docs = listings.stream()
    for doc in docs:
        doc.reference.delete()

################################################################################
# User Functions                                                               #
################################################################################

def get_all_users():
    """
    Retrieves all users from Firestore database
    """
    docs = users.stream()
    return [doc.to_dict() for doc in docs]

def number_of_users():
    """
    Returns the number of users in Firestore database
    """
    return sum(1 for _ in users.stream())

def get_user_by_id(user_id):
    """
    Retrieves a user by their ID from Firestore database
    """
    doc = users.document(str(user_id)).get()
    return doc.to_dict() if doc.exists else None

def get_user_by_email(email):
    """
    Retrieves a user by their email from Firestore database
    """
    docs = users.where('email', '==', email).get()
    return docs[0].to_dict() if docs else None

def create_user(user):
    """
    Creates a new user in Firestore database
    """
    docref = users.document(str(user['id']))
    docref.set(user)
    return docref.id

def update_user(user_id, user):
    """
    Updates an existing user in Firestore database
    """
    users.document(user_id).update(user)
    return user

def delete_user(user_id):
    """
    Deletes an existing user from Firestore database
    """
    users.document(user_id).delete()

def delete_all_users():
    """
    Deletes all users from Firestore database
    """
    docs = users.stream()
    for doc in docs:
        doc.reference.delete()

################################################################################
# Chat Functions                                                               #
################################################################################

def save_message(user1_email, user2_email, message):
    chat_id = f"{min(user1_email, user2_email)}_to_{max(user1_email, user2_email)}"
    chat_ref = chats.document(chat_id)

    # Set or update 'messages' with Firestore transactions
    doc = chat_ref.get()
    if doc.exists:
        chat_ref.update({'messages': firestore.ArrayUnion([message])})
    else:
        chat_ref.set({'messages': [message]})

def get_chats_between_users(user1_email, user2_email):
    chat_id = f"{min(user1_email, user2_email)}_to_{max(user1_email, user2_email)}"
    chat_doc = chats.document(chat_id).get()

    if chat_doc.exists:
        return chat_doc.to_dict().get('messages', [])
    return []