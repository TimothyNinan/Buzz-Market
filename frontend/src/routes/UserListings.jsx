import './Home.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function UserListings() {
    const [listings, setListings] = useState([]);
    const navigate = useNavigate();
    const { loggedInEmail } = useAuth();

    const [currentPage, setCurrentPage] = useState(1);
    const listingsPerPage = 8;
    const indexOfLastListing = currentPage * listingsPerPage;
    const indexOfFirstListing = indexOfLastListing - listingsPerPage;
    const currentListings = listings.slice(indexOfFirstListing, indexOfLastListing);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        async function fetchUserListings() {
            try {
                // Get user data by email
                const userResponse = await fetch(`http://127.0.0.1:5000/user-by-email?email=${loggedInEmail}`);
                const userData = await userResponse.json();
                const userId = userData.id;
                // Fetch listings by userId
                const response = await fetch(`http://127.0.0.1:5000/user/listings/${userId}`);
                const data = await response.json();
                setListings(data);
            } catch (error) {
                console.error('Error fetching user listings:', error);
            }
        }

        if (loggedInEmail) {
            fetchUserListings();
        }
    }, [loggedInEmail]);

    const removeListing = (id) => {
        fetch(`http://127.0.0.1:5000/listings/${id}`, {
            method: 'DELETE',
        })
            .then(() => setListings(listings.filter(listing => listing.id !== id)))
            .catch(err => console.error('Error deleting listing:', err));
    };

    return (
        <div className="entire-page">
            <div className="container mt-3">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Your Listings</h2>
                    <button className="btn btn-primary" onClick={() => navigate('/home')}>
                        Back to Home
                    </button>
                </div>
                <div className="row g-4 mx-1">
                    {currentListings.map(listing => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={listing.id} name="listingsHolder">
                            <div className="card mx-3" style={{ width: '100%' }}>
                                {listing.img ? (
                                    <img src={listing.img} alt={listing.title} className="card-img-top" style={{ height: '10rem' }} />
                                ) : (
                                    <div className="d-flex justify-content-center align-items-center" 
                                        style={{ height: '10rem', backgroundColor: '#f0f0f0', color: '#888' }}>
                                        No image available
                                    </div>
                                )}
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <h5 className="card-title text-start text-truncate" style={{ cursor: 'pointer', height: '1.7rem', maxWidth: '10rem' }} onClick={() => navigate(`/item/${listing.id}`)} title={listing.title}>
                                            {listing.title}
                                        </h5>
                                        <button className="btn btn-danger" onClick={() => removeListing(listing.id)}>Remove</button>
                                    </div>
                                    <p className="card-subtitle mb-2 text-body-secondary text-start">{listing.description}</p>
                                    <p className="card-text text-start lead">{'$' + listing.price}</p>
                                    <p className="card-text text-start">
                                        <span className="badge bg-secondary">{listing.category}</span>
                                        <span className="badge bg-secondary mx-1">{listing.condition}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="pagination">
                        {[...Array(Math.ceil(listings.length / listingsPerPage))].map((_, index) => (
                            <button 
                                key={index + 1} 
                                onClick={() => paginate(index + 1)}
                                className={`btn ${index + 1 === currentPage ? 'btn-secondary' : 'btn-outline-secondary'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserListings;