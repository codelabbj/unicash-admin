import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    FiHome, FiUsers, FiGlobe, FiWifi, FiDollarSign,
    FiCreditCard, FiList, FiSettings, FiX, FiImage, FiShield, FiLink
} from 'react-icons/fi';



const Sidebar = ({ onClose }) => {
    const { user } = useAuth();

    const menuItems = [
        { path: '/admin/dashboard', icon: FiHome, label: 'Dashboard' },
        { path: '/admin/banners', icon: FiImage, label: 'Bannières' },
        { path: '/admin/users', icon: FiUsers, label: 'Utilisateurs' },
        // { path: '/admin/countries', icon: FiGlobe, label: 'Pays' },
        { path: '/admin/networks', icon: FiWifi, label: 'Réseaux' },
        // { path: '/admin/fee-configs', icon: FiDollarSign, label: 'Frais' },
        { path: '/admin/aggregators', icon: FiCreditCard, label: 'Agrégateurs' },
        { path: '/admin/aggregator-mappings', icon: FiLink, label: 'Mappings' },
        { path: '/admin/transactions', icon: FiList, label: 'Transactions' },
        { path: '/admin/kyc', icon: FiShield, label: 'Vérification KYC' },
        { path: '/admin/settings', icon: FiSettings, label: 'Paramètres' },
    ];

    return (
        <div className="h-full flex flex-col py-6">
            {/* Mobile Close Button (only if onClose is provided) */}
            {onClose && (
                <div className="flex justify-end px-6 mb-4 lg:hidden">
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                        <FiX className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 space-y-1 scroll-smooth">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative
              ${isActive
                                ? 'bg-primary/5 text-primary font-bold'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
                            }
            `}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`w-[20px] h-[20px] transition-transform duration-300 group-hover:scale-105 ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                <span className="text-[14px] tracking-tight">{item.label}</span>
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"></div>
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
