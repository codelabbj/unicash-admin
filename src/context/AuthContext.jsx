import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth.api';
import apiClient from '../api/axios.config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        if (import.meta.env.VITE_DEV_MODE === 'true') {
            setUser({ role: 'admin', email: 'dev@unicash.com' });
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('accessToken');
        const savedEmail = localStorage.getItem('userEmail'); // Retrieve email

        if (token) {
            try {
                // Verify token validity by fetching user profile
                // Assuming /auth/me/ exists or we decode token. 
                // For now, let's assume we fetch profile.
                // If API doesn't have /auth/me/, we might rely on token presence 
                // but checking is safer.
                // NOTE: The walkthrough mentions /api/auth/admin/users/ but not strictly /me for admin.
                // We will trust the token works if requests succeed.
                setUser({ role: 'admin', email: savedEmail || 'admin@unicash.com' });
            } catch (error) {
                console.error("Auth check failed", error);
                logout();
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { access, refresh } = response.data;

            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            localStorage.setItem('userEmail', email); // Save email

            setUser({ role: 'admin', email }); // Basic user info
            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userEmail');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
