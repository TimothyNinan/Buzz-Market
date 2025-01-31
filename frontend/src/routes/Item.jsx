import './Item.css';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Item() {
    const navigate = useNavigate();
    const { id } = useParams(); 
    const [listing, setListing] = useState(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/listings/${id}`)
            .then(response => response.json())
            .then(data => setListing(data))
            .catch(error => console.error('Error fetching listing:', error));
    }, [id]);

    const handleEmailClick = (email) => {
        navigate(`/chat/${email}`);
    };

    if (!listing) return <div>Loading...</div>;

    return (
        <div className="item-page">
            <div className='container-fluid' style={{border: '100px solid #003057', borderRadius: '8px', width: '60vw'}}>
                <div className="row flex-nowrap">
                    <div className="col mt-3 text-start">
                        <h1 style={{textAlign: 'left'}}>{listing.title}</h1>
                    </div>
                    <div className="col mt-3 text-end">
                        <button className="btn btn-secondary mt-1 text-white" style={{width: '200px'}} onClick={() => {/* Add to watchlist logic */}}>
                            <i className="bi bi-heart text-white"></i> Add to Watchlist
                        </button>
                    </div>
                </div>
                <div className="row justify-content-center align-items-center mx-3" style={{border: '2px solid #B3A369', borderRadius: '8px'}}>
                {listing.img ? (
                            <img
                            src={listing.img} 
                            alt={listing.title} 
                            className="" 
                            style={{
                                display: 'block',
                                maxWidth: '50rem',
                                width: 'auto',
                                height: 'auto',
                                maxHeight: '15rem',
                                border: '5px solid #B3A369',
                                borderRadius: '8px'
                            }} 
                            />
                            ) : (
                                <div className="d-flex justify-content-center align-items-center" 
                                    style={{width: '30vw', height: '10rem', backgroundColor: '#f0f0f0', color: '#888', borderRadius: '8px'}}>
                                    No image available
                                </div>
                            )}
                    <hr className="divider" />
                    <div className="mt-3 text-start">
                        <p>{listing.description}</p>
                        <hr className="divider" />
                        <p><strong>Price:</strong> ${listing.price}</p>
                        <hr className="divider" />
                        <p><strong>Category:</strong> {listing.category?.charAt(0).toUpperCase() + listing.category?.slice(1)}</p>
                        <hr className="divider" />
                        <p><strong>Condition:</strong> {listing.condition?.charAt(0).toUpperCase() + listing.condition?.slice(1)}</p>
                        <hr className="divider" />
                        <p><strong>Owner's Username:</strong> {listing.seller.name}</p>
                        <hr className="divider" />
                        <p><strong>Owner's Email:</strong> <span style={{color: 'navy', cursor: 'pointer', textDecoration: 'underline'}} onClick={() => handleEmailClick(listing.seller.email)}>{listing.seller.email}</span></p>
                    </div>
                </div>
                <div className="row">
                    <button name="back-button" className="btn btn-secondary mt-3" onClick={() => navigate('/home')}>Back to Home</button>
                </div>
            </div>
        </div>
    );
}

export default Item;