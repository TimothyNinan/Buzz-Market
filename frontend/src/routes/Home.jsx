import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'

import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

import { filterByCategory, filterByCondition, sortListingsByPrice } from './filterStrategies';

function Home() {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending, 'desc' for descending
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const listingsPerPage = 8;
    const indexOfLastListing = currentPage * listingsPerPage;
    const indexOfFirstListing = indexOfLastListing - listingsPerPage;
    const currentListings = filteredListings.slice(indexOfFirstListing, indexOfLastListing);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const [watchList, setWatchList] = useState([]);

    const { loggedInEmail } = useAuth();

    const fetchListings = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/listings');
            const data = await response.json();
            const sortedData = data.sort((a, b) => a.price - b.price); // Sort in ascending order by default
            setListings(data);
            setFilteredListings(data);
        } catch (error) {
            console.error('Error fetching listings:', error);
        }
    };
    const fetchWatchList = async() => {
        const response = await fetch('http://127.0.0.1:5000/watchlists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: loggedInEmail }),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch watchlist: ${response.status} ${response.statusText}`);
        }

        const watchlistIds = await response.json();
        setWatchList(watchlistIds)
    }

    useEffect(() => {
        console.log("getting listings and watchlist")
        fetchListings();
        fetchWatchList();
    }, []);

    useEffect(() => {
        filterListings();
    }, [category, condition, sortOrder]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        navigate('/');
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        const filtered = listings.filter(listing =>
            listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            listing.seller.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredListings(filtered);
    };
  
    const filterListings = () => {
        let filtered = [...listings];
        filtered = filterByCategory(filtered, category);
        filtered = filterByCondition(filtered, condition);
        filtered = sortListingsByPrice(filtered, sortOrder);
        setFilteredListings(filtered);
    };

    const watchListClicked = (id) => {
        if (watchList.includes(id)) {
            updateWatchListCall(1, id)
            setWatchList(prev_list => prev_list.filter(listingId => listingId !== id))
        } else {
            updateWatchListCall(0, id)
            setWatchList([...watchList, id])
        }
    }

    const updateWatchListCall = async(op, lid) => {
        //console.log("Update local loved/not loved state and make api call to sync database")
        
        try {
            const req = {
                'email': loggedInEmail,
                'op': op,
                'lid': lid
            }
            const response = await fetch('http://127.0.0.1:5000/update_watchlist', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req),
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch watchlist: ${response.status} ${response.statusText}`);
            }

            const watchlistIds = await response.json();
            //console.log(watchlistIds);
            
        } catch (error) {
            console.error('Error fetching watchlist:', error.message);
        }
    }

    return (
        <div className="entire-page">
            <div className="container mt-3">
                <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                        <h1 className="title me-3">Buzz Market</h1>
                        <img src={"/images/buzz-logo.png"} alt="Buzz Mascot" className="buzz-image" style={{ height: '50px' }} />
                    </div>
                    <div className="d-flex align-items-end mb-4">
                        <button name="watchlist-button" className="btn btn-outline-primary text-white align-items-end mx-2" onClick={() => navigate('/watchlist')}>
                        Watchlist <i className="bi bi-heart text-white"></i> 
                        </button>
                        <button
                            className="btn btn-outline-primary text-white mx-2"
                            onClick={() => navigate('/user-listings')}
                        >
                            Your Listings
                        </button>
                        <button 
                            className="btn btn-outline-primary text-white align-items-end mx-2" 
                            onClick={() => navigate('/chat')}
                        >
                            Chat
                        </button>
                        <button className="btn btn-outline-primary text-white align-items-end" name="logout-button" onClick={handleLogout}>Logout</button>       
                
                    </div>
                    </div>
                <div className="row">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button name = "search-button" className="btn btn-primary mt-2" onClick={handleSearchClick}>Search</button>
                </div>
                <div className="row g-4">
                    <div className="col-md">
                        <div className="form-floating">
                        <select className="form-select" id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">All</option>
                            <option value="electronics">Electronics</option>
                            <option value="clothing">Clothing</option>
                            <option value="books">Books</option>
                            <option value="home">Home</option>
                            <option value="other">Other</option>
                        </select>
                        <label htmlFor="category">
                            Category  
                        </label>
                        </div>
                    </div>
                    <div className="col-md">
                        <div className="form-floating">
                            <select className="form-select" id="condition" value={condition} onChange={(e) => setCondition(e.target.value)}>
                                <option value="">All</option>
                                <option value="new">New</option>
                                <option value="like-new">Like New</option>
                                <option value="good">Good</option>
                                <option value="fair">Fair</option>
                                <option value="poor">Poor</option>
                            </select>
                            <label htmlFor="condition">
                                Condition
                            </label>
                        </div>
                    
                    </div>
                    <div className="col-md">
                        <div className="form-floating">
                            <select className="form-select" id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                            <label htmlFor="sortOrder">
                                Price
                            </label>
                        </div>
                    </div>
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
                                <h5 className="card-title text-start text-truncate" style={{cursor: 'pointer', height: '1.7rem', maxWidth: '10rem'}} onClick={() => navigate(`/item/${listing.id}`)} title={listing.title}>
                                        {listing.title}
                                </h5>
                                <p className="card-text text-start lead">{'$' + listing.price}</p>
                            </div>
                            
                            <p className="card-subtitle mb-2 text-body-secondary text-start">{listing.description}</p>
                            <p className="card-text text-start">
                                <span className={`badge rounded-pill ${
                                    listing.category === 'electronics' ? 'bg-primary' :
                                    listing.category === 'other' ? 'bg-secondary' :
                                    listing.category === 'clothing' ? 'bg-success' :
                                    listing.category === 'books' ? 'bg-info' :
                                    listing.category === 'home' ? 'bg-dark' :
                                    'bg-secondary'
                                }`}>{listing.category?.charAt(0).toUpperCase() + listing.category?.slice(1)}</span>
                                <span className={`badge rounded-pill mx-1 ${
                                    listing.condition === 'new' ? 'bg-success' :
                                    listing.condition === 'like-new' ? 'bg-info' :
                                    listing.condition === 'good' ? 'bg-primary' :
                                    listing.condition === 'fair' ? 'bg-warning' :
                                    listing.condition === 'poor' ? 'bg-danger' :
                                    'bg-secondary'
                                }`}>{listing.condition?.charAt(0).toUpperCase() + listing.condition?.slice(1)}</span>
                                <button className="btn btn-outline-primary text-white align-items-end mx-2"
                                    onClick={(e) => {watchListClicked(listing.id)}}>
                                    {watchList.includes(listing.id)
                                        ? <i className="bi bi-heart-fill text-danger"></i> 
                                        : <i className="bi bi-heart text-white"></i>
                                    }
                                </button>
                            </p>
                            
                            <p className="card-text text-end" style={{fontSize: '1rem'}}>By: {listing.seller}</p>
                            
                            <p className="card-text text-end" style={{fontSize: '0.8rem'}}>{new Date(listing.date_posted).toLocaleString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit', 
                                second: '2-digit',
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                                hour12: true
                            })}</p>
                            </div>
                            </div>
                        </div>
                    ))}
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <div name="createListingButton" className="card mx-3 hover-effect" onClick={() => navigate('/create-listing')} style={{width: '100%', cursor: 'pointer', minHeight: '24rem'}}>
                            <div className="card-body d-flex justify-content-center align-items-center" style={{height: '100%', fontSize: '7rem'}}>
                                <span className="display-1">+</span>
                            </div>
                        </div>
                    </div>
                    <div className="pagination">
                        {[...Array(Math.ceil(filteredListings.length / listingsPerPage))].map((_, index) => (
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

export default Home;
