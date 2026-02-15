import React from 'react';

const CommissionGraph = ({ data }) => {
    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '-';
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(amount);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    if (!data || data.length === 0) {
        return (
            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 text-center">
                <p className="text-sm text-slate-500">Aucune donnée disponible</p>
            </div>
        );
    }

    // Show only last 7 days with transactions
    const recentData = data.slice(-7).filter(item => item.count > 0);
    
    if (recentData.length === 0) {
        return (
            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 text-center">
                <p className="text-sm text-slate-500">Aucune transaction récente</p>
            </div>
        );
    }

    const maxValue = Math.max(...recentData.map(d => d.profit || 0), 0.01);

    return (
        <div className="space-y-3">
            {recentData.map((item, index) => {
                const heightPercentage = Math.max(((item.profit || 0) / maxValue) * 100, 5);
                
                return (
                    <div key={index} className="flex items-center gap-3">
                        <div className="w-20 text-xs font-medium text-slate-600">
                            {formatDate(item.date)}
                        </div>
                        <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                            <div
                                className="h-full bg-primary/80 rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
                                style={{ width: `${heightPercentage}%` }}
                            >
                                <span className="text-[10px] font-bold text-white">{formatCurrency(item.profit)}</span>
                            </div>
                        </div>
                        <div className="w-12 text-xs text-slate-400 text-right">
                            {item.count} tx
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default CommissionGraph;
