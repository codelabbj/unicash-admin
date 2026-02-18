import React from 'react';

const CommissionMonthsChart = ({ data }) => {
    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '-';
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);
    };

    const formatMonth = (monthStr) => {
        if (!monthStr) return 'N/A';
        const date = new Date(monthStr);
        return date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
    };

    if (!data || data.length === 0) {
        return (
            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 text-center">
                <p className="text-sm text-slate-500">Aucune donnée disponible</p>
            </div>
        );
    }

    // Filter months with data and show last 6 months
    const activeMonths = data.filter(item => item.count > 0).slice(-6);

    if (activeMonths.length === 0) {
        return (
            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 text-center">
                <p className="text-sm text-slate-500">Aucune transaction ce mois</p>
            </div>
        );
    }

    const maxValue = Math.max(...activeMonths.map(d => d.profit || 0), 0.01);

    return (
        <div className="flex items-end gap-3 h-48 px-2">
            {activeMonths.map((item, index) => {
                const heightPercentage = Math.max(((item.profit || 0) / maxValue) * 100, 8);

                return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex items-end justify-center" style={{ height: '120px' }}>
                            <div
                                className="w-full max-w-[50px] bg-primary/80 rounded-t-lg transition-all duration-700 hover:bg-primary relative group"
                                style={{ height: `${heightPercentage}%` }}
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {formatCurrency(item.profit)}
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-slate-900 uppercase">{formatMonth(item.month)}</p>
                            <p className="text-[9px] font-bold text-primary">{formatCurrency(item.profit)}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CommissionMonthsChart;
