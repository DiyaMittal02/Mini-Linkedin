import React, { useContext, useState, useEffect } from 'react';
import api from '../api';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Profile() {
    const { id } = useParams();
    const { user: currentUser } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState(null);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/users/${id}`);
                setUser(res.data.user);
                setPosts(res.data.posts);
            } catch (err) {
                alert('Failed to load profile');
                console.error('Profile fetch error:', err.response ? err.response.data : err.message);
            }
        };
        fetchProfile();
    }, [id]);

    useEffect(() => {
        const fetchConnectionStatus = async () => {
            if (!currentUser || currentUser.id === Number(id)) {
                setConnectionStatus(null);
                return;
            }
            setLoadingStatus(true);
            try {
                const res = await api.get(`/connections/status/${currentUser.id}/${id}`);
                setConnectionStatus(res.data.status);
            } catch (err) {
                console.error('Failed to fetch connection status', err);
                setConnectionStatus('none');
            } finally {
                setLoadingStatus(false);
            }
        };
        fetchConnectionStatus();
    }, [currentUser, id]);

    const handleSendRequest = async () => {
        if (!currentUser) {
            alert('You must be logged in to send a connection request.');
            return;
        }
        setActionLoading(true);
        try {
            await api.post(`/connections/request/${id}`);
            alert('Connection request sent!');
            setConnectionStatus('requested');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to send connection request.');
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    if (!user) return <p>Loading profile...</p>;

    return (
        <div
            style={{
                maxWidth: 700,
                margin: '2rem auto',
                backgroundColor: '#fff',
                padding: '2rem',
                borderRadius: 8,
                boxShadow: '0 1px 8px rgba(0,0,0,0.1)',
            }}
        >
            <h2 style={{ color: '#0a66c2' }}>{user.name}</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Bio:</strong> {user.bio || 'No bio provided'}</p>

            {currentUser && currentUser.id !== Number(id) && (
                <div style={{ margin: '1rem 0' }}>
                    {loadingStatus ? (
                        <button disabled style={{ padding: '0.5rem 1rem', cursor: 'not-allowed' }}>
                            Checking connection status...
                        </button>
                    ) : (
                        <>
                            {connectionStatus === 'connected' && (
                                <button disabled style={{ padding: '0.5rem 1rem', backgroundColor: '#0a66c2', color: '#fff', borderRadius: 4, border: 'none' }}>
                                    Connected
                                </button>
                            )}
                            {connectionStatus === 'requested' && (
                                <button disabled style={{ padding: '0.5rem 1rem', backgroundColor: '#808080', color: '#fff', borderRadius: 4, border: 'none' }}>
                                    Request Sent
                                </button>
                            )}
                            {(connectionStatus === 'none' || connectionStatus === null) && (
                                <button
                                    onClick={handleSendRequest}
                                    disabled={actionLoading}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#0a66c2',
                                        color: '#fff',
                                        borderRadius: 4,
                                        border: 'none',
                                        cursor: actionLoading ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {actionLoading ? 'Sending...' : 'Connect'}
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}

            <h3>Posts:</h3>
            {posts.length === 0 ? <p>No posts yet.</p> : posts.map(post => (
                <div key={post.id} style={{ borderBottom: '1px solid #ccc', padding: '0.5rem 0' }}>
                    <p>{post.content}</p>
                    <small>{new Date(post.created_at).toLocaleString()}</small>
                </div>
            ))}
        </div>
    );
}
