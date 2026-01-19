import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiDollarSign, FiMail } from 'react-icons/fi';
import logo from '../../assets/Unicash.png';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await login(email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Identifiants invalides ou erreur serveur.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Floating money bill decorations */}
            <div className="absolute top-10 left-10 text-gray-200 opacity-50 animate-pulse">
                <FiDollarSign className="w-12 h-12" />
            </div>
            <div className="absolute top-20 right-20 text-gray-200 opacity-30">
                <FiDollarSign className="w-16 h-16" />
            </div>
            <div className="absolute bottom-32 left-1/4 text-gray-200 opacity-40">
                <FiDollarSign className="w-10 h-10" />
            </div>
            <div className="absolute bottom-20 right-1/3 text-gray-200 opacity-30 animate-pulse">
                <FiDollarSign className="w-14 h-14" />
            </div>

            <div className="glass-panel p-10 w-full max-w-md relative z-10 animate-fade-in-up">
                <div className="text-center mb-8">
                    <img
                        src={logo}
                        alt="UniCash"
                        className="w-48 h-auto mx-auto drop-shadow-sm"
                    />
                    <p className="text-slate-500 text-lg mt-3 font-medium tracking-wide">Administration</p>
                </div>

                {error && (
                    <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm mb-6 border border-rose-100 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                            <FiMail className="w-5 h-5" />
                        </div>
                        <input
                            type="email"
                            placeholder="Email Administrateur"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 glass-input rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none transition-all"
                            required
                        />
                    </div>

                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                            <FiLock className="w-5 h-5" />
                        </div>
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 glass-input rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3.5 px-6 btn-primary rounded-xl font-semibold text-[15px] tracking-wide mt-2
              ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Connexion...' : 'Se connecter'}
                    </button>
                </form>

                <div className="mt-8 text-center text-xs text-slate-400 font-medium uppercase tracking-wider">
                    <p>Accès Sécurisé • UniCash Admin</p>
                </div>
            </div>
            {/* More floating money decorations */}
            <div className="absolute top-1/3 right-10 text-gray-200 opacity-40">
                <FiDollarSign className="w-12 h-12" />
            </div>
            <div className="absolute bottom-1/4 left-20 text-gray-200 opacity-30 animate-pulse">
                <FiDollarSign className="w-10 h-10" />
            </div>
        </div>
    );
};

export default AdminLogin;
