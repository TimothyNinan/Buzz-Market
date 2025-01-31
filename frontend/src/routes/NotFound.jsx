import './NotFound.css';
import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="container">
            <img src="/images/buzz-logo.png" alt="Buzz Logo" className="buzz-logo" />
            <h1>Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
            <button onClick={() => navigate('/home')}>Back to Home</button>
        </div>
    );
}

export default NotFound;

