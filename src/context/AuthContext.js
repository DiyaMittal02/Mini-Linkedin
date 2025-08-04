import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';  // Named import

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
            try {
                const decoded = jwtDecode(savedToken);
                setUser({ id: decoded.id, email: decoded.email });
            } catch {
                setUser(null);
                setToken(null);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        const decoded = jwtDecode(newToken);
        setUser({ id: decoded.id, email: decoded.email });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Export useAuth hook for easy access to AuthContext
export function useAuth() {
    return useContext(AuthContext);
}
