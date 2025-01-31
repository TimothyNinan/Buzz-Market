import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './ChatBox.css';

function ChatBox() {
    const { loggedInEmail } = useAuth();
    const { email } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [activeChatUser, setActiveChatUser] = useState(email || null);  // Currently selected user to chat with
    const [availableUsers, setAvailableUsers] = useState([]);    // Available users list
    const [username] = useState(loggedInEmail || 'Anonymous');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    useEffect(() => {
        // Load available users from the backend when the component mounts
        async function fetchUsers() {
            try {
                const response = await fetch('http://localhost:5000/api/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const usersData = await response.json();
                setAvailableUsers(usersData.filter(user => user.email !== loggedInEmail));
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        fetchUsers();
    }, [loggedInEmail]);

    useEffect(() => {
        let interval;
        if (activeChatUser) {
            interval = setInterval(fetchChatHistory, 3000); // Poll every 3 seconds
        }
        return () => clearInterval(interval); // Clean up on unmount or when activeChatUser changes
    }, [activeChatUser, username]);

    const fetchChatHistory = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/chat-history?user1=${username}&user2=${activeChatUser}`);
            if (!response.ok) {
                throw new Error('Failed to fetch chat history');
            }
            const chatHistory = await response.json();
            setMessages(chatHistory.messages || []);
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

    const sendMessage = async () => {
        if (message.trim() && activeChatUser) {
            try {
                const response = await fetch('http://localhost:5000/api/send-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ msg: message, username, other_username: activeChatUser }),
                });
                if (!response.ok) {
                    throw new Error('Failed to send message');
                }
                setMessage('');
                // Refresh chat history after sending
                fetchChatHistory();
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = availableUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(availableUsers.length / usersPerPage);

    const nextPage = () => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    const prevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));


    return (
        <div className="chat-page">
            <div className="chatbox">
                <div className="user-list-container">
                    <h3>Available Users to Chat</h3>
                    <ul>
                    {currentUsers.map(user => (
                        <li 
                        key={user.email} 
                        onClick={() => setActiveChatUser(user.email)} 
                        style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }} 
                        >
                        {user.email}
                        </li>
                    ))}
                    </ul>
                    <div className="pagination-controls">
                        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
                    </div>
                </div>
                <div className="chat-container">
                    <h3>Chat with {activeChatUser || "a Selected User"}</h3>
                    <div className="messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-bubble ${msg.sender === username ? 'current-user' : 'other-user'}`}>
                                {msg.msg}
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message"
                    />
                    <button onClick={sendMessage} disabled={!activeChatUser}>Send</button>
                    <button 
                        className="btn btn-outline-primary text-white align-items-end mx-2"
                        onClick={() => navigate('/home')}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatBox;