import React, { useContext, useEffect, useState } from 'react';
import api from '../api';
import PostForm from '../components/PostForm';
import ConnectionRequests from '../components/ConnectionRequests';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ProfileCard from './components/ProfileCard';

export default function Home() {
    const { user } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);

    // Fetch logged-in user's profile data
    useEffect(() => {
        if (user && user.id) {
            api.get(`/users/${user.id}`)
                .then(res => setProfile(res.data.user))
                .catch(() => setProfile(null));
        }
    }, [user]);

    // Fetch posts for main feed
    const fetchPosts = async () => {
        try {
            const res = await api.get('/posts');
            setPosts(res.data);
        } catch {
            alert('Failed to load posts');
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div
            className="app-main-layout"
            style={{
                display: 'flex',
                gap: '2rem',
                maxWidth: 1100,
                margin: '2rem auto',
                alignItems: 'flex-start',
                padding: '0 1rem',
                minHeight: 'calc(100vh - 80px)', // adjust for navbar height
            }}
        >
            {/* Sidebar: Profile info + Connection Requests */}
            <aside
                className="sidebar-profile"
                style={{
                    width: '270px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.09)',
                    padding: '2rem 1.3rem 1.5rem 1.3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'sticky',
                    top: 80,
                    height: 'fit-content',
                    gap: '2rem',
                }}
            >
                {/* Profile Summary */}
                {profile ? (
                    <>
                        <div
                            className="profile-avatar"
                            aria-label="User avatar"
                            style={{
                                background: '#e5f0fb',
                                color: '#0a66c2',
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '2.4rem',
                                fontWeight: 'bold',
                                marginBottom: '1rem',
                                userSelect: 'none',
                            }}
                        >
                            {profile.name.charAt(0).toUpperCase()}
                        </div>
                        <div
                            className="profile-name"
                            style={{
                                color: '#0a66c2',
                                fontWeight: '700',
                                fontSize: '1.3rem',
                                marginBottom: '0.2rem',
                                textAlign: 'center',
                            }}
                        >
                            {profile.name}
                        </div>
                        <div
                            className="profile-email"
                            style={{
                                fontSize: '0.97rem',
                                color: '#333',
                                marginBottom: '0.6rem',
                                textAlign: 'center',
                                wordBreak: 'break-word',
                            }}
                        >
                            {profile.email}
                        </div>
                        <div
                            className="profile-bio"
                            style={{
                                fontSize: '0.95rem',
                                color: '#555',
                                textAlign: 'center',
                                marginBottom: '1rem',
                                whiteSpace: 'pre-wrap',
                            }}
                        >
                            {profile.bio || 'No bio available'}
                        </div>
                        <Link
                            to={`/profile/${profile.id}`}
                            style={{
                                fontWeight: 600,
                                color: '#0a66c2',
                                textDecoration: 'none',
                                padding: '0.3rem 0.75rem',
                                border: '1px solid #0a66c2',
                                borderRadius: 6,
                                transition: 'background-color 0.25s ease',
                                userSelect: 'none',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0a66c2'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            View Profile
                        </Link>
                    </>
                ) : (
                    <div>Loading profile...</div>
                )}

                {/* Connection Requests Widget */}
                <ConnectionRequests />
            </aside>

            {/* Main Feed Section */}
            <main
                className="main-feed"
                style={{
                    flex: 1,
                    minWidth: 0,
                }}
            >
                <h2
                    style={{
                        color: '#0a66c2',
                        fontWeight: '700',
                        marginBottom: '1.5rem',
                    }}
                >
                    Home Feed
                </h2>

                <PostForm onPost={fetchPosts} />

                <div className="post-list">
                    {posts.length === 0 ? (
                        <p>No posts yet.</p>
                    ) : (
                        posts.map(post => (
                            <article
                                key={post.id}
                                className="post-card"
                                style={{
                                    background: 'white',
                                    borderRadius: 10,
                                    boxShadow: '0 3px 8px rgba(0,0,0,0.06)',
                                    marginBottom: '1.5rem',
                                    padding: '1.5rem 2rem',
                                    wordWrap: 'break-word',
                                }}
                            >
                                <p>{post.content}</p>
                                <div
                                    className="post-info"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '0.9rem',
                                        color: '#7f8c8d',
                                        fontWeight: 500,
                                    }}
                                >
                                    <Link
                                        to={`/profile/${post.author_id}`}
                                        style={{ color: '#0a66c2', fontWeight: 600 }}
                                    >
                                        {post.name}
                                    </Link>
                                    <time dateTime={new Date(post.created_at).toISOString()}>
                                        {new Date(post.created_at).toLocaleString()}
                                    </time>
                                </div>

                            </article>
                        ))
                    )}
                </div>

            </main>
        </div>
    );
}
