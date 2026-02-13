import React from 'react';
import { FiMenu, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/Unicash-logo.png';

const Header = ({ onMenuClick }) => {
    const { logout, user } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    return (
        <header className="bg-white border-b border-gray-100 px-6 py-3 sticky top-0 z-30">
            <div className="flex items-center justify-between">
                {/* Left: Logo & Mobile Menu */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-xl hover:bg-gray-50 text-slate-600 transition-colors"
                    >
                        <FiMenu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-3">
                        <img src={logo} alt="UniCash" className="h-10 w-auto" />
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-primary tracking-tight leading-none hidden md:block">UniCash Admin</span>
                            <span className="text-xs font-medium text-slate-400 hidden md:block mt-0.5">Gérer votre plateforme</span>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4 relative">
                    <div className="h-8 w-[1px] bg-gray-200 hidden md:block"></div>

                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                        >
                            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                {user?.email ? user.email.substring(0, 2).toUpperCase() : 'AD'}
                            </div>
                        </button>

                        {/* Profile Dropdown */}
                        {isProfileOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-30"
                                    onClick={() => setIsProfileOpen(false)}
                                ></div>
                                <div className="absolute right-0 top-12 z-40 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                    <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                                        <p className="text-sm font-bold text-slate-800">Administrateur</p>
                                        <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{user?.email || 'admin@unicash.com'}</p>
                                    </div>
                                    <div className="p-1.5">
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium text-sm"
                                        >
                                            <FiLogOut className="w-4 h-4" />
                                            Déconnexion
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
