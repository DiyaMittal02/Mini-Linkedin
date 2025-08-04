import React, { useEffect, useState } from 'react';
import api from '../api'; // Your Axios instance

export default function ConnectionRequests() {
    const [requests, setRequests] = useState([]);

    // Fetch connection requests function
    const fetchRequests = async () => {
        try {
            const res = await api.get('/connections/requests');
            setRequests(res.data);
        } catch (err) {
            alert('Failed to load connection requests');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // Accept connection request
    const handleAccept = async (id) => {
        try {
            await api.post(`/connections/accept/${id}`);
            fetchRequests(); // Refresh after accept
        } catch (err) {
            alert('Failed to accept connection request');
            console.error(err);
        }
    };

    // Decline connection request
    const handleDecline = async (id) => {
        try {
            await api.post(`/connections/decline/${id}`);
            fetchRequests(); // Refresh after decline
        } catch (err) {
            alert('Failed to decline connection request');
            console.error(err);
        }
    };

    if (requests.length === 0) return <p>No connection requests</p>;

    return (
        <div>
            <h3>Connection Requests</h3>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {requests.map(({ connectionId, userId, name, email, bio }) => (
                    <li key={connectionId} style={{ marginBottom: '1rem', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>
                        <div><strong>{name}</strong> ({email})</div>
                        <div style={{ marginBottom: '0.5rem', color: '#555' }}>{bio || <em>No bio available</em>}</div>
                        <button onClick={() => handleAccept(connectionId)} style={{ cursor: 'pointer' }}>Accept</button>
                        <button onClick={() => handleDecline(connectionId)} style={{ marginLeft: '0.5rem', cursor: 'pointer' }}>Decline</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
