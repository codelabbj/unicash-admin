import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiLock, FiMail, FiShield } from 'react-icons/fi';
import { formatErrorForDisplay } from '../../utils/errorHandler';
import logo from '../../assets/Unicash-logo.png';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await login(email, password);
            toast.success('Connexion réussie !');
            navigate('/admin/dashboard');
        } catch (err) {
            toast.error(formatErrorForDisplay(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-inter">
            {/* Minimalist Background Deco */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
                <div className="absolute top-10 left-10"><FiShield size={120} /></div>
                <div className="absolute bottom-10 right-10 rotate-12"><FiShield size={160} /></div>
            </div>

            <div className="glass-card p-8 w-full max-w-[380px] relative z-10 animate-fade-in-up border-white/40 shadow-2xl">
                <div className="text-center mb-6">
                    <div className="inline-block p-3 rounded-2xl bg-white shadow-sm border border-slate-100 mb-4">
                        <img
                            src={logo}
                            alt="UniCash"
                            className="w-32 h-auto mx-auto"
                        />
                    </div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight">Administration</h1>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mt-1.5">Accès Sécurisé</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Email</label>
                        <div className="relative group">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                <FiMail className="w-4 h-4" />
                            </div>
                            <input
                                type="email"
                                placeholder="adresse email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Mot de passe</label>
                        <div className="relative group">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                <FiLock className="w-4 h-4" />
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-6 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-[14px] tracking-tight shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98] mt-2
              ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        UniCash v2.0 • Admin Panel
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
