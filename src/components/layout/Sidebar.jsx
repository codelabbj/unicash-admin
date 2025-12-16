import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FiHome, FiUsers, FiGlobe, FiWifi, FiDollarSign,
    FiCreditCard, FiList, FiSettings, FiX
} from 'react-icons/fi';

const Sidebar = ({ onClose }) => {
    const menuItems = [
        { path: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
        { path: '/admin/users', icon: FiUsers, label: 'Utilisateurs' },
        { path: '/admin/countries', icon: FiGlobe, label: 'Pays' },
        { path: '/admin/networks', icon: FiWifi, label: 'Réseaux' },
        { path: '/admin/fee-configs', icon: FiDollarSign, label: 'Frais' },
        { path: '/admin/aggregators', icon: FiCreditCard, label: 'Agrégateurs' },
        { path: '/admin/transactions', icon: FiList, label: 'Transactions' },
        { path: '/admin/settings', icon: FiSettings, label: 'Paramètres' },
    ];

    return (
        <div className="h-full flex flex-col">
            {/* Logo & Close Button */}
            <div className="flex items-center justify-between p-4 border-b">
                <h1 className="text-xl font-bold text-blue-600">UniCash Admin</h1>
                {onClose && (
                    <button onClick={onClose} className="md:hidden">
                        <FiX className="w-6 h-6" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 mb-2 rounded-lg
              transition-colors duration-200
              ${isActive
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'text-gray-700 hover:bg-gray-100'
                            }
            `}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Info */}
            <div className="p-4 border-t">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        A
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
                        <p className="text-xs text-gray-500 truncate">admin@unicash.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
