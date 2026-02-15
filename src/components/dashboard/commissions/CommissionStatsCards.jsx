import React from 'react';

const CommissionStatsCards = ({ stats }) => {
    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '-';
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
    };

    const total = stats?.total || {};
    const today = stats?.today || {};
    const thisMonth = stats?.this_month || {};

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Profit Total</p>
                <p className="text-xl font-black text-slate-900">{formatCurrency(total.profit)}</p>
                <p className="text-xs text-slate-400 mt-1">{total.count || 0} transactions</p>
            </div>
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Volume Total</p>
                <p className="text-xl font-black text-slate-900">{formatCurrency(total.volume)}</p>
            </div>
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Profit Aujourd'hui</p>
                <p className="text-xl font-black text-slate-900">{formatCurrency(today.profit)}</p>
                <p className="text-xs text-slate-400 mt-1">{today.count || 0} transactions</p>
            </div>
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">Profit Ce Mois</p>
                <p className="text-xl font-black text-slate-900">{formatCurrency(thisMonth.profit)}</p>
            </div>
        </div>
    );
};

export default CommissionStatsCards;
