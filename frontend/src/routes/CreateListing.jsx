import './CreateListing.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';


function CreateListing() {
    const navigate = useNavigate();

    const [bytes, setBytes] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setBytes(reader.result);
          };
          reader.readAsDataURL(file); // Convert to base64
        }
      };

    const handleSubmit = (e) => {
        e.preventDefault()
        const title = e.target.title.value
        const description = e.target.description.value
        const price = e.target.price.value
        const category = e.target.category.value
        const condition = e.target.condition.value
        const token = localStorage.getItem('token')
        const seller = token ? JSON.parse(atob(token.split('.')[1])).user_id : null
        const img = bytes

        const listing = {
            title,
            description,
            price,
            category,
            condition,
            seller,
            img
        }

        fetch('http://127.0.0.1:5000/create-listing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(listing),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            navigate(`/item/${data.listing.id}`);
            // You can add additional logic here, such as showing a success message or redirecting the user
        })
        .catch((error) => {
            console.error('Error:', error);
            // You can add error handling logic here, such as showing an error message to the user
        });


        console.log('Form submitted', title, description, price, category, condition)
    }
    return (
        <div className="container mt-5" style={{maxWidth: '50rem', width: '45vw'}}>
            <h2>Create a New Listing</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" rows="3" required></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input type="number" className="form-control" id="price" step="0.01" min="0" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category</label>
                    <select className="form-select" id="category" required>
                        <option value="">Select a category</option>
                        <option value="electronics">Electronics</option>
                        <option value="clothing">Clothing</option>
                        <option value="books">Books</option>
                        <option value="home">Home</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="condition" className="form-label">Condition</label>
                    <select className="form-select" id="condition" required>
                        <option value="">Select condition</option>
                        <option value="new">New</option>
                        <option value="like-new">Like New</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="poor">Poor</option>
                    </select>
                </div>
                <input id="image" type="file" onChange={handleImageChange} accept="image/*" />
                <button name="submit-button" type="submit" className="btn btn-primary mx-2">Create Listing</button>
                <button className="btn btn-primary" onClick={() => navigate('/home')}>Back to Home</button>
            </form>
        </div>
    )
}

export default CreateListing