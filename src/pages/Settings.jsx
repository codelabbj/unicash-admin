import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiLock, FiShield, FiEye, FiEyeOff } from 'react-icons/fi';
import { authAPI } from '../api/auth.api';

const Settings = () => {
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const validateForm = () => {
        if (!passwordData.old_password || !passwordData.new_password || !passwordData.confirm_password) {
            toast.error("Veuillez remplir tous les champs");
            return false;
        }
        if (passwordData.new_password !== passwordData.confirm_password) {
            toast.error("Le nouveau mot de passe et la confirmation ne correspondent pas");
            return false;
        }
        if (passwordData.new_password.length < 6) {
            toast.error("Le nouveau mot de passe doit contenir au moins 6 caractères");
            return false;
        }
        return true;
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await authAPI.changePassword({
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            });
            toast.success("Mot de passe mis à jour avec succès !");
            setPasswordData({
                old_password: '',
                new_password: '',
                confirm_password: ''
            });
        } catch (error) {
            console.error("Password update failed:", error);
            const backendError = error.response?.data?.old_password?.[0] ||
                error.response?.data?.error ||
                error.response?.data?.message ||
                "Échec de la mise à jour du mot de passe";
            toast.error(backendError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight text-center sm:text-left">Paramètres de Sécurité</h1>
                <p className="text-[13px] text-slate-500 font-medium mt-1 text-center sm:text-left">Gérez la sécurité de votre compte administrateur.</p>
            </div>

            <div className="glass-card rounded-[2rem] p-8 border-none ring-1 ring-black/5 bg-gradient-to-br from-white to-slate-50/50">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600">
                        <FiShield size={20} />
                    </div>
                    <h2 className="text-[17px] font-black text-slate-900 tracking-tight">Changer le mot de passe</h2>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    {/* Old Password */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Ancien mot de passe</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-rose-500 transition-colors">
                                <FiLock size={16} />
                            </div>
                            <input
                                type={showPasswords.old ? "text" : "password"}
                                name="old_password"
                                value={passwordData.old_password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl py-3.5 pl-11 pr-12 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-rose-500/20 focus:bg-white transition-all outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('old')}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPasswords.old ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Nouveau mot de passe</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                <FiLock size={16} />
                            </div>
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                name="new_password"
                                value={passwordData.new_password}
                                onChange={handleChange}
                                placeholder="Nouveau mot de passe (min. 6 char.)"
                                className="w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl py-3.5 pl-11 pr-12 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPasswords.new ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider ml-1">Confirmer le nouveau mot de passe</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                <FiLock size={16} />
                            </div>
                            <input
                                type={showPasswords.confirm ? "text" : "password"}
                                name="confirm_password"
                                value={passwordData.confirm_password}
                                onChange={handleChange}
                                placeholder="Confirmer le mot de passe"
                                className="w-full bg-slate-50 border-none ring-1 ring-slate-200 rounded-2xl py-3.5 pl-11 pr-12 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPasswords.confirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-slate-200"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <FiLock className="w-4 h-4" />
                                <span>Mettre à jour le mot de passe</span>
                            </>
                        )}
                    </button>
                </form>
            </div>

            <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-100 flex gap-4">
                <div className="p-2 h-fit bg-amber-100 rounded-xl text-amber-700">
                    <FiShield size={18} />
                </div>
                <div>
                    <h4 className="text-[13px] font-black text-amber-900 tracking-tight">Conseil de sécurité</h4>
                    <p className="text-[12px] text-amber-800/80 font-medium mt-1 leading-relaxed">
                        Utilisez un mot de passe fort combinant des lettres majuscules, minuscules, des chiffres et des symboles pour une sécurité maximale.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
