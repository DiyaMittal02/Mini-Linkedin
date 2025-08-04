import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', bio: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', form);
            alert('Registration successful. Please log in.');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '3rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: 8, backgroundColor: 'white' }}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required style={{ width: '100%', marginBottom: 10, padding: 8 }} />
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ width: '100%', marginBottom: 10, padding: 8 }} />
                <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required style={{ width: '100%', marginBottom: 10, padding: 8 }} />
                <textarea name="bio" placeholder="Bio (optional)" value={form.bio} onChange={handleChange} style={{ width: '100%', marginBottom: 10, padding: 8 }} />
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#0a66c2', color: 'white', border: 'none', cursor: 'pointer' }}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>
            <p style={{ marginTop: '1rem' }}>
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </div>
    );
}
