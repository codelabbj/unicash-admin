import React from 'react';

const StatCard = ({ label, value, color }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-24">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">{label}</span>
        <span className={`text-3xl font-black ${color}`}>{value}</span>
    </div>
);

const NetworkStats = ({ networks = [] }) => {
    const totalNetworks = networks.length;
    // Assuming 'countries' or unique country codes can be derived. 
    // If networks have a 'country' field which is a UID or Code.
    const activeCountries = new Set(networks.filter(n => n.is_active).map(n => n.country)).size;
    const activeNetworks = networks.filter(n => n.is_active).length;
    // Assuming 'maintenance' status or just inactive for now as a placeholder logic or if there's a specific field.
    // For now, let's assume inactive = maintenance for simplicity, or just use a placeholder if no field exists.
    const maintenanceNetworks = networks.filter(n => !n.is_active).length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Réseaux" value={totalNetworks} color="text-slate-900" />
            <StatCard label="Pays Actifs" value={activeCountries} color="text-slate-900" />
            <StatCard label="Actifs" value={activeNetworks} color="text-emerald-500" />
            <StatCard label="Maintenance" value={maintenanceNetworks} color="text-orange-500" />
        </div>
    );
};

export default NetworkStats;
