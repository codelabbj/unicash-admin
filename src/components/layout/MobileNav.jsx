import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiList, FiSettings } from 'react-icons/fi';

const MobileNav = () => {
    const navItems = [
        { path: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
        { path: '/admin/users', icon: FiUsers, label: 'Users' },
        { path: '/admin/transactions', icon: FiList, label: 'Transactions' },
        { path: '/admin/settings', icon: FiSettings, label: 'Settings' },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
            <div className="flex justify-around">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex flex-col items-center gap-1 py-3 px-4 flex-1
              ${isActive ? 'text-blue-600' : 'text-gray-600'}
            `}
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="text-xs">{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default MobileNav;
