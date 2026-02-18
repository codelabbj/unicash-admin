import React from 'react';
import { FiMenu, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/Unicash-logo.png';

const Header = ({ onMenuClick }) => {
    const { logout, user } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-primary/5 px-6 py-4 sticky top-0 z-40">
            {/* Vibrant accent line on top */}
            <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-primary via-indigo-500 to-accent"></div>

            <div className="flex items-center justify-between">
                {/* Left: Logo & Mobile Menu */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2.5 rounded-xl bg-slate-50 hover:bg-primary/5 text-slate-600 transition-all active:scale-90"
                    >
                        <FiMenu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="relative">
                            <img src={logo} alt="UniCash" className="h-10 w-auto transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
                            <div className="absolute -inset-2 bg-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="flex flex-col border-l border-slate-100 pl-4">
                            <span className="text-xl font-black text-slate-900 tracking-tighter leading-none hidden md:block">UniCash Admin</span>
                            <span className="text-[10px] font-black text-primary/50 uppercase tracking-[0.2em] hidden md:block mt-1.5 italic">Management Hub</span>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-5 relative">
                    <div className="h-8 w-[1px] bg-slate-100 hidden md:block"></div>

                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 transition-all group"
                        >
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center font-black text-sm shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                                {user?.email ? user.email.substring(0, 2).toUpperCase() : 'AD'}
                            </div>
                            <div className="flex flex-col items-start pr-2 hidden sm:flex">
                                <span className="text-xs font-black text-slate-900 leading-none">Administrateur</span>
                                <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Paramètres profil</span>
                            </div>
                        </button>

                        {/* Profile Dropdown */}
                        {isProfileOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-30"
                                    onClick={() => setIsProfileOpen(false)}
                                ></div>
                                <div className="absolute right-0 top-14 z-40 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 origin-top-right">
                                    <div className="p-5 border-b border-slate-50 bg-slate-50/20">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black">
                                                {user?.email?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-sm font-black text-slate-900">Admin</p>
                                                <p className="text-[11px] text-slate-400 font-bold truncate max-w-[140px] mt-0.5">{user?.email || 'admin@unicash.com'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-black text-[13px] group"
                                        >
                                            <div className="p-2 rounded-lg bg-rose-50 group-hover:bg-rose-100 transition-colors">
                                                <FiLogOut className="w-4 h-4" />
                                            </div>
                                            Se déconnecter
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
