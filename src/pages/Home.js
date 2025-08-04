import React, { useContext, useEffect, useState } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import ProfileCard from '../components/ProfileCard';
import PostForm from '../components/PostForm';
import ConnectionRequests from '../components/ConnectionRequests';
import { Link } from 'react-router-dom';

// Example News Panel
function NewsPanel() {
    return (
        <aside className="side-panel card">
            <div className="side-panel-title">LinkedIn News</div>
            <ul>
                <li><strong>AI and authenticity</strong><br /><span>3h ago • 25,000+ readers</span></li>
                <li><strong>Top cities see salaries rise</strong><br /><span>2h ago • 12,900+ readers</span></li>
                <li><strong>New tariffs impact trade</strong><br /><span>1h ago • 7,000+ readers</span></li>
            </ul>
        </aside>
    );
}

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
        <div className="linkedin-layout">
            {/* Sidebar (Left): Profile and Quick links */}
            <section className="sidebar-left">
                {profile ? (
                    <ProfileCard
                        id={profile.id}
                        name={profile.name}
                        email={profile.email}
                        bio={profile.bio}
                    // Add any extra fields as needed
                    />
                ) : (
                    <div>Loading profile...</div>
                )}

                <div className="card stats-card">
                    <div className="stat-row">
                        <span className="stat-label">Profile viewers</span>
                        <span className="stat-value">103</span>
                    </div>
                    <div className="stat-row">
                        <span className="stat-label">Post impressions</span>
                        <span className="stat-value">15</span>
                    </div>
                </div>
                <div className="card links-card">
                    <Link to="#">Saved items</Link>
                    <Link to="#">Groups</Link>
                    <Link to="#">Newsletters</Link>
                    <Link to="#">Events</Link>
                    <Link to="#">Jobs</Link>
                </div>
            </section>

            {/* Main Feed (Middle) */}
            <main className="main-feed">
                <div className="card post-form-container">
                    <PostForm onPost={fetchPosts} />
                </div>
                <ConnectionRequests />
                <div className="post-list">
                    {posts.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#777' }}>No posts yet.</p>
                    ) : (
                        posts.map(post => (
                            <article key={post.id} className="card post-card">
                                <div className="post-header">
                                    <div className="avatar-sm">{post.name ? post.name[0].toUpperCase() : '?'}</div>
                                    <div>
                                        <Link to={`/profile/${post.author_id}`} className="author">{post.name}</Link>
                                        <div className="created-at">{new Date(post.created_at).toLocaleString()}</div>
                                    </div>
                                </div>
                                <p className="post-content">{post.content}</p>
                            </article>
                        ))
                    )}
                </div>
            </main>

            {/* News/Trending Panel (Right) */}
            <NewsPanel />
        </div>
    );
}
