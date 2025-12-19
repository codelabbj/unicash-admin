import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FiHome, FiUsers, FiGlobe, FiWifi, FiDollarSign,
    FiCreditCard, FiList, FiSettings, FiX, FiImage
} from 'react-icons/fi';
import logo from '../../assets/Unicash-logo.png';


const Sidebar = ({ onClose }) => {
    const menuItems = [
        { path: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
        { path: '/admin/banners', icon: FiImage, label: 'Bannières' },
        { path: '/admin/users', icon: FiUsers, label: 'Utilisateurs' },
        { path: '/admin/countries', icon: FiGlobe, label: 'Pays' },
        { path: '/admin/networks', icon: FiWifi, label: 'Réseaux' },
        { path: '/admin/fee-configs', icon: FiDollarSign, label: 'Frais' },
        { path: '/admin/aggregators', icon: FiCreditCard, label: 'Agrégateurs' },
        { path: '/admin/transactions', icon: FiList, label: 'Transactions' },
        { path: '/admin/settings', icon: FiSettings, label: 'Paramètres' },
    ];

    return (
        <div className="h-full flex flex-col bg-white border-r border-gray-100">
            {/* Logo & Close Button */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <img src={logo} alt="UniCash Admin" className="h-10 w-auto" />
                {onClose && (
                    <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700">
                        <FiX className="w-6 h-6" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive
                                ? 'bg-blue-50 text-primary font-semibold shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }
            `}
                    >
                        <item.icon className={`w-5 h-5 ${({ isActive }) => isActive ? 'text-primary' : 'text-gray-400'}`} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Info */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 m-4 rounded-xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shadow-sm">
                        A
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">Administrateur</p>
                        <p className="text-xs text-gray-500 truncate">admin@unicash.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
