import React from 'react';
import { FiMenu, FiBell, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const Header = ({ onMenuClick }) => {
    const { logout } = useAuth(); // Assuming useAuth provides logout

    return (
        <header className="glass-panel mb-4 rounded-xl mx-4 md:mx-6 lg:mx-8 mt-3 sticky top-3 z-30 px-2 py-1.5">
            <div className="flex items-center justify-between px-1">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 rounded-lg hover:bg-slate-100/80 transition-colors text-slate-600 active:scale-95 transform"
                >
                    <FiMenu className="w-5.5 h-5.5" />
                </button>

                {/* Search Bar (Hidden on mobile) */}
                <div className="hidden md:block flex-1 max-w-md ml-3">
                    <div className="relative group">
                        <input
                            type="search"
                            placeholder="Rechercher..."
                            className="w-full pl-9 pr-3 py-1.5 glass-input rounded-lg text-[13px] placeholder-slate-400 text-slate-700 transition-all focus:w-[102%]"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 md:gap-3 pl-3">
                    {/* Notifications */}
                    <button className="relative p-2 rounded-lg hover:bg-white/60 hover:shadow-sm transition-all text-slate-600 active:scale-95 group">
                        <FiBell className="w-[18px] h-[18px] group-hover:text-primary transition-colors" />
                        <span className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>
                    </button>

                    <div className="h-6 w-[1px] bg-slate-200/60 hidden md:block"></div>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-all font-semibold text-[13px] hover:shadow-sm active:scale-95"
                    >
                        <FiLogOut className="w-4 h-4" />
                        <span className="hidden md:inline">Déconnexion</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
