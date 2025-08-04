import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

export default function PeopleSearch() {
    const [q, setQ] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch users either all or filtered
    const fetchUsers = async (searchTerm) => {
        setLoading(true);
        try {
            const res = await api.get(`/users/search?q=${encodeURIComponent(searchTerm)}`);
            setResults(res.data.results);
        } catch {
            alert('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    // On mount, load all users
    useEffect(() => {
        fetchUsers('');
    }, []);

    // Handle form submission (redundant now but keeps search button usable)
    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(q);
    };

    // Optionally fetch on query change (for live search)
    // useEffect(() => {
    //   const timeoutId = setTimeout(() => fetchUsers(q), 300);
    //   return () => clearTimeout(timeoutId);
    // }, [q]);

    return (
        <div className="people-search-container">
            <form className="search-bar" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search people by name or email…"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    autoFocus
                />
                <button type="submit">🔍</button>
            </form>
            {loading && <div>Loading users...</div>}
            <ul className="search-results">
                {results.length > 0 ? (
                    results.map(u => (
                        <li className="search-result-card" key={u.id}>
                            <Link to={`/profile/${u.id}`}>
                                <div className="avatar">
                                    {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="search-user-name">{u.name}</div>
                                    <div className="search-user-email">{u.email}</div>
                                    <div className="search-user-bio">{u.bio}</div>
                                </div>
                            </Link>
                        </li>
                    ))
                ) : (
                    !loading && <li>No users found.</li>
                )}
            </ul>
        </div>
    );
}
