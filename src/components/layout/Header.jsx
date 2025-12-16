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
                <div className="hidden md:flex flex-1 max-w-md">
                    <input
                        type="search"
                        placeholder="Rechercher..."
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
