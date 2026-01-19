import React from 'react';
import { FiMenu, FiBell, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const Header = ({ onMenuClick }) => {
    const { logout } = useAuth(); // Assuming useAuth provides logout

    return (
        <header className="glass-panel mb-6 rounded-2xl mx-4 md:mx-6 lg:mx-8 mt-4 sticky top-4 z-30 px-2 py-2">
            <div className="flex items-center justify-between px-2">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2.5 rounded-xl hover:bg-slate-100/80 transition-colors text-slate-600 active:scale-95 transform"
                >
                    <FiMenu className="w-6 h-6" />
                </button>

                {/* Search Bar (Hidden on mobile) */}
                <div className="hidden md:block flex-1 max-w-md ml-4">
                    <div className="relative group">
                        <input
                            type="search"
                            placeholder="Rechercher..."
                            className="w-full pl-11 pr-4 py-2.5 glass-input rounded-xl text-sm placeholder-slate-400 text-slate-700 transition-all focus:w-[102%]"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3 md:gap-4 pl-4">
                    {/* Notifications */}
                    <button className="relative p-2.5 rounded-xl hover:bg-white/60 hover:shadow-sm transition-all text-slate-600 active:scale-95 group">
                        <FiBell className="w-5 h-5 md:w-5.5 md:h-5.5 group-hover:text-primary transition-colors" />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>
                    </button>

                    <div className="h-8 w-[1px] bg-slate-200/60 hidden md:block"></div>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-medium text-sm hover:shadow-sm active:scale-95"
                    >
                        <FiLogOut className="w-4.5 h-4.5" />
                        <span className="hidden md:inline">Déconnexion</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
