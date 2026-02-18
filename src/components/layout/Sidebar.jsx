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
        { path: '/admin/dashboard', icon: FiHome, label: 'Tableau de bord' },
        { path: '/admin/banners', icon: FiImage, label: 'Bannières' },
        { path: '/admin/users', icon: FiUsers, label: 'Utilisateurs' },
        { path: '/admin/networks', icon: FiWifi, label: 'Réseaux' },
        { path: '/admin/aggregators', icon: FiCreditCard, label: 'Agrégateurs' },
        { path: '/admin/aggregator-mappings', icon: FiLink, label: 'Mappings' },
        { path: '/admin/transactions', icon: FiList, label: 'Transactions' },
        { path: '/admin/kyc', icon: FiShield, label: 'Vérification KYC' },
        { path: '/admin/settings', icon: FiSettings, label: 'Paramètres' },
    ];

    return (
        <div className="h-full flex flex-col py-6 bg-gradient-to-b from-[#2534C1] to-[#1a258a] shadow-2xl relative overflow-hidden">
            {/* Background Decorative Circles */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/2 -right-32 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Mobile Close Button */}
            {onClose && (
                <div className="flex justify-end px-6 mb-4 lg:hidden relative z-10">
                    <button onClick={onClose} className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-90 border border-white/10">
                        <FiX className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 space-y-2 relative z-10 custom-sidebar-scroll">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden
                            ${isActive
                                ? 'bg-white text-primary shadow-xl shadow-black/10 font-black'
                                : 'text-indigo-100 hover:bg-white/10 hover:text-white font-medium'
                            }
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`w-[20px] h-[20px] transition-all duration-300 group-hover:scale-110 ${isActive ? 'text-primary' : 'text-indigo-200 group-hover:text-white'}`} />
                                <span className="text-[14px] tracking-wide">{item.label}</span>

                                {isActive && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-l-full"></div>
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
