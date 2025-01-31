import './WatchList.css';
import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const ListingItem = ({ listing, onRemove }) => {
    const navigate = useNavigate();

    return (
        <div className="list_item">
            <h3 style={{ cursor: 'pointer' }} onClick={() => navigate(`/item/${listing.id}`)}>
                {listing.title}
            </h3>
            <p>{listing.description}</p>
            <p><strong>Price:</strong> ${listing.price}</p>
            <button onClick={() => onRemove(listing)}>Remove</button>
        </div>
    );
};

const Watchlist = () => {
    const navigate = useNavigate();

    const [watchlist, setWatchlist] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [listingsPerPage] = useState(10);

    const { loggedInEmail } = useAuth();

    // initial loading of the watchlist
    const fetchWatchList = async () => {
        try {
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
            console.log(watchlistIds); // Use console.log instead of print

            const fetchedListings = [];

            for (const id of watchlistIds) {
                const listingResponse = await fetch(`http://127.0.0.1:5000/listings/${id}`);
                if (listingResponse.ok) {
                    const listingData = await listingResponse.json();
                    fetchedListings.push(listingData);
                } else {
                    console.error('Error fetching listing:', listingResponse.statusText);
                }
            }
            console.log(fetchedListings)
            setWatchlist(fetchedListings)

        } catch (error) {
            console.error('Error fetching watchlist:', error.message);
        }

    };

    useEffect(() => {
        fetchWatchList();
        console.log("l;asdjflfasd")
    }, [loggedInEmail]); // Make sure to use a dependency array for conditional fetching

    // if adding to watchlist, rerender the state and make a post call to update backend
    // Take in the listing obj
    const addToWatchlist = (listing) => {
        setWatchlist([...watchlist, listing]);
    };

    // if removing from watchlist, rerender the state and make delte call to update backend
    // Take in the listing obj
    const remToWatchList = (listing) => {
        setWatchlist(prev => prev.filter(item => item.id !== listing.id));
    }

    const indexOfLastListing = currentPage * listingsPerPage;
    const indexOfFirstListing = indexOfLastListing - listingsPerPage;
    const currentListings = watchlist.slice(indexOfFirstListing, indexOfLastListing);
    const paginate = pageNumber => setCurrentPage(pageNumber);

    // Display the watchlist
    return (
        <div className="watch-page">
            <div>
                <h2>Watchlist</h2>
                <button className="btn btn-secondary" style={{ marginBottom: '20px' }} onClick={() => navigate('/home')}>Back to Home</button>
                <div className='watchlist_container'>
                    {currentListings.length ?
                    (
                        currentListings.map((listing) => <ListingItem key={listing.id} listing={listing} onRemove={() => remToWatchList(listing)} />)
                    ):(
                        <p>There nothing in your watchlist boooo...</p>
                    )}
                </div>
                <div className="pagination">
                    {[...Array(Math.ceil(watchlist.length / listingsPerPage))].map((_, index) => (
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
    );
};

export default Watchlist;