from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import json

from user import User
from listingFactory import ListingFactory
from storage import Storage
import firestore as firestoreAPI

from werkzeug.security import generate_password_hash, check_password_hash
import jwt

import uuid
from datetime import datetime, timedelta

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret_key_here'
cors = CORS(app, resources={r"/*": {"origins": "*"}})

# storage = Storage()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    if not email or not password or not name:
        return jsonify({'message': 'Missing required fields'}), 400
    

    if firestoreAPI.get_user_by_email(email) != None:
        return jsonify({'message': 'User already exists'}), 400

    user_id = firestoreAPI.number_of_users() + 1

    hashed_password = generate_password_hash(password)

    new_user = User(id=user_id, name=name, email=email, password=hashed_password, watchlist=[])
    
    # save user to firestore
    firestoreAPI.create_user(new_user.to_dict())

    token = jwt.encode(
        {'user_id': user_id, 'exp': datetime.utcnow() + timedelta(hours=1)},
        app.config['SECRET_KEY'], algorithm="HS256"
    )
    return jsonify({'token': token}), 200


@app.route('/login', methods=['POST'])
def login():    
    data = request.json
    email = data.get('email')
    password = data.get('password')

    userFromFirestore = firestoreAPI.get_user_by_email(email)
    user = User.from_dict(userFromFirestore)
    if user and user.verify_password(password):
        token = jwt.encode(
            {'user_id': user.id, 'exp': datetime.utcnow() + timedelta(hours=1)},
            app.config['SECRET_KEY'], algorithm="HS256"
        )
        return jsonify({'token': token}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401


@app.route('/create-listing', methods=['POST'])
def create_listing():
    data = request.json

    # generate a unique id for the listing
    # Get all current listings and find the highest ID
    id = firestoreAPI.number_of_listings() + 1
    title = data.get('title')
    description = data.get('description')
    price = data.get('price')

    # if any of the required fields are missing, return an error
    if not title or not description or not price:
        return jsonify({'message': 'Missing required fields'}), 400

    seller = data.get('seller')
    img = data.get('img')
    category = data.get('category')
    condition = data.get('condition')
    date_posted = datetime.now()
    
    listing = {
        'id': id,
        'date_posted': date_posted,
        'title': title,
        'description': description,
        'price': price,
        'seller': seller,
        'img': img,
        'category': category,
        'condition': condition,
    }
    
    listingObject = ListingFactory.create_listing_from_dict(listing)

    # save listing to database
    created_listing_id = firestoreAPI.create_listing(listingObject.to_dict())
    print("Created listing ID: ", created_listing_id)

    return jsonify({'message': 'Listing created successfully', 'listing': listingObject.to_dict()}), 201

@app.route('/listings', methods=['GET'])
def get_listings():
    listings = firestoreAPI.get_all_listings()
    # Convert seller IDs to names for each listing
    for listing in listings:
        seller_id = listing.get('seller')
        seller = firestoreAPI.get_user_by_id(seller_id)
        if seller:
            listing['seller'] = seller.get('name', seller_id)  # Fallback to ID if name not found
    # print(listings)
    return jsonify([listing for listing in listings]), 200

@app.route('/listings/<int:listing_id>', methods=['GET'])
def get_listing(listing_id):
    listing = firestoreAPI.get_listing_by_id(listing_id)
    seller_id = listing.get('seller')
    seller = firestoreAPI.get_user_by_id(seller_id)
    if seller:
        listing['seller'] = {
            'name': seller.get('name', seller_id),
            'email': seller.get('email', '')  # Include the seller's email
        }
    return jsonify(listing), 200

@app.route('/listings/<int:listing_id>', methods=['DELETE'])
def delete_listing(listing_id):
    firestoreAPI.delete_listing(listing_id)
    return jsonify({'message': 'Listing deleted successfully'}), 200

@app.route('/listings/<int:listing_id>', methods=['PUT'])
def update_listing(listing_id):
    data = request.json
    firestoreAPI.update_listing(listing_id, data)
    return jsonify({'message': 'Listing updated successfully'}), 200

@app.route('/watchlists', methods=['POST'])
def get_watchlist():
    data = request.json
    print(data)
    watchlist_arr = firestoreAPI.get_watchlist(data.get('email'))
    return jsonify(watchlist_arr), 200

@app.route('/update_watchlist', methods=['PUT'])
def update_watchlist():
    data = request.json
    watchlist_arr = firestoreAPI.update_watchlist(data)
    return jsonify(watchlist_arr), 200

@app.route('/user/listings/<int:user_id>', methods=['GET'])
def get_user_listings(user_id): 
    listings = firestoreAPI.get_listings_by_user_id(user_id)
    return jsonify(listings), 200

@app.route('/user-by-email', methods=['GET'])
def get_user_by_email():
    email = request.args.get('email')
    if not email:
        return jsonify({'message': 'Email parameter is missing'}), 400

    user_data = firestoreAPI.get_user_by_email(email)
    if user_data:
        return jsonify(user_data), 200
    else:
        return jsonify({'message': 'User not found'}), 404
    

@app.route('/api/users', methods=['GET'])
def get_all_users():
    try:
        users = firestoreAPI.get_all_users()
        return jsonify(users), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch users', 'error': str(e)}), 500

# WARNING: These endpoints are for testing purposes only and will delete all data in the database

@app.route('/listings/warning/deleteAll', methods=['GET'])
def delete_all_listings():
    firestoreAPI.delete_all_listings()
    return jsonify({'message': 'All listings deleted successfully'}), 200

@app.route('/listings/warning/deleteAllUsers', methods=['GET'])
def delete_all_users():
    firestoreAPI.delete_all_users()
    return jsonify({'message': 'All users deleted successfully'}), 200


# CHATBOX CODE
@app.route('/api/chat-history', methods=['GET'])
def chat_history():
    user1 = request.args.get('user1')
    user2 = request.args.get('user2')
    if not user1 or not user2:
        return jsonify({'message': 'Both users are required'}), 400

    messages = firestoreAPI.get_chats_between_users(user1, user2)
    return jsonify({'messages': messages}), 200

@app.route('/api/send-message', methods=['POST'])
def send_message():
    data = request.json
    user1 = data['username']
    user2 = data['other_username']
    message_content = data['msg']

    firestoreAPI.save_message(user1, user2, {'msg': message_content, 'sender': user1})
    return jsonify({'message': 'Message sent successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)