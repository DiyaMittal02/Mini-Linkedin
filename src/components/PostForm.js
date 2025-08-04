import React, { useState } from 'react';
import api from '../api'; // Axios instance pointing to backend

export default function PostForm({ onPost }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!content.trim()) return;
        setLoading(true);
        try {
            await api.post('/posts', { content });
            setContent('');
            if (onPost) onPost();  // Optionally reload posts
        } catch (err) {
            alert('Failed to post: ' + (err.response?.data?.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ backgroundColor: "white", borderRadius: 8, padding: "2rem", maxWidth: 400, margin: "2rem auto", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="What's on your mind?"
                style={{ width: "100%", minHeight: 70, fontSize: 16, padding: 8, borderRadius: 4, border: "1px solid #bbb", marginBottom: "1rem" }}
            />
            <button
                type="submit"
                disabled={loading || !content.trim()}
                style={{ background: "#0a66c2", color: "#fff", border: "none", borderRadius: 4, padding: "0.7rem 1.5rem", fontWeight: 600, fontSize: 16, width: "100%", cursor: loading ? "not-allowed" : "pointer" }}
            >
                {loading ? "Posting..." : "Post"}
            </button>
        </form>
    );
}
