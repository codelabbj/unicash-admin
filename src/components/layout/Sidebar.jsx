import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    FiHome, FiUsers, FiGlobe, FiWifi, FiDollarSign,
    FiCreditCard, FiList, FiSettings, FiX, FiImage
} from 'react-icons/fi';
import logo from '../../assets/Unicash-logo.png';


const Sidebar = ({ onClose }) => {
    const { user } = useAuth();

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
        <div className="glass-panel h-full rounded-3xl flex flex-col overflow-hidden border-white/60 shadow-xl">
            {/* Logo & Close Button */}
            <div className="flex items-center justify-between p-6">
                <img src={logo} alt="UniCash Admin" className="h-9 w-auto" />
                {onClose && (
                    <button onClick={onClose} className="md:hidden p-2 rounded-xl hover:bg-slate-100/50 text-slate-500 transition-colors">
                        <FiX className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 space-y-1.5 scroll-smooth">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
              ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/25 font-medium'
                                : 'text-slate-600 hover:bg-slate-100/60 hover:text-slate-900'
                            }
            `}
                    >
                        <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${({ isActive }) => isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`} />
                        <span className="text-[14.5px] tracking-wide">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Info */}
            <div className="p-4 mt-2">
                <div className="glass-card p-3 rounded-2xl flex items-center gap-3 hover:bg-white/80 transition-colors cursor-pointer border border-white/60 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 text-sm">
                        AD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">Admin</p>
                        <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5" title={user?.email}>
                            {user?.email || 'admin@unicash.com'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
