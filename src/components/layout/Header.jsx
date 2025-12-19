import React from 'react';
import { FiMenu, FiBell, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const Header = ({ onMenuClick }) => {
    const { logout } = useAuth(); // Assuming useAuth provides logout

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="flex items-center justify-between px-4 py-3 md:px-6">
                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                    <FiMenu className="w-6 h-6" />
                </button>

                {/* Search Bar (Hidden on mobile) */}
                <div className="hidden md:flex flex-1 max-w-md ml-4">
                    <div className="relative w-full">
                        <input
                            type="search"
                            placeholder="Rechercher..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Notifications */}
                    <button className="relative p-2 rounded-lg hover:bg-gray-100">
                        <FiBell className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <FiLogOut className="w-5 h-5" />
                        <span className="hidden md:inline">Déconnexion</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
