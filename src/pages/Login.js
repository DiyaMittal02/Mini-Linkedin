import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', form);
            login(res.data.token);  // Save token & set user context
            navigate('/');          // Redirect to dashboard/home
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '3rem auto', padding: '2rem', border: '1px solid #ccc', borderRadius: 8, backgroundColor: 'white' }}>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ width: '100%', marginBottom: 10, padding: 8 }} />
                <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required style={{ width: '100%', marginBottom: 10, padding: 8 }} />
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#0a66c2', color: 'white', border: 'none', cursor: 'pointer' }}>
                    {loading ? 'Logging in...' : 'Sign In'}
                </button>
            </form>
            <p style={{ marginTop: '1rem' }}>
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
        </div>
    );
}
