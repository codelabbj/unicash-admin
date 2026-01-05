import React from 'react';
import { FiDollarSign, FiUsers, FiCreditCard, FiActivity, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import StatCard from '../components/dashboard/StatCard';

const volumeData = [
    { name: 'Lun', volume: 1200000 },
    { name: 'Mar', volume: 1500000 },
    { name: 'Mer', volume: 900000 },
    { name: 'Jeu', volume: 2100000 },
    { name: 'Ven', volume: 1800000 },
    { name: 'Sam', volume: 2400000 },
    { name: 'Dim', volume: 2800000 },
];

const statusData = [
    { name: 'Succès', value: 450, color: '#10B981' },
    { name: 'En attente', value: 120, color: '#F59E0B' },
    { name: 'Échec', value: 45, color: '#EF4444' },
];

const recentTransactions = [
    { id: 1, ref: 'UC-789-456', user: 'Jean Dupont', amount: '5,050 F', status: 'Succès' },
    { id: 2, ref: 'UC-123-456', user: 'Marie Curis', amount: '25,250 F', status: 'En attente' },
    { id: 3, ref: 'UC-456-789', user: 'Paul Koffi', amount: '2,020 F', status: 'Échec' },
];

const Dashboard = () => {
    return (
        <div className="space-y-8 pb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 font-heading">Tableau de bord</h1>
                    <p className="text-sm text-gray-500">Bienvenue, voici un aperçu de l'activité UniCash.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Volume Total" value="15 245 000 F" icon={FiDollarSign} color="blue" />
                <StatCard title="Utilisateurs" value="1,234" icon={FiUsers} color="green" />
                <StatCard title="Transactions" value="856" icon={FiCreditCard} color="yellow" />
                <StatCard title="Frais Collectés" value="450 000 F" icon={FiActivity} color="red" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Volume Chart */}
                <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">Volume de Transactions (7 j)</h2>
                        <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            <FiArrowUpRight /> +12% vs semaine dernière
                        </span>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={volumeData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    tickFormatter={(value) => `${value / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`${value.toLocaleString()} F`, 'Volume']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="volume"
                                    stroke="#1e40af"
                                    strokeWidth={3}
                                    dot={{ fill: '#1e40af', r: 4, strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Breakthrough */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Répartition par Statut</h2>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Latest Activities & Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">Transactions Récentes</h2>
                        <button className="text-sm font-medium text-primary hover:underline">Voir tout</button>
                    </div>
                    <div className="space-y-4">
                        {recentTransactions.map((txn) => (
                            <div key={txn.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${txn.status === 'Succès' ? 'bg-green-100 text-green-600' :
                                        txn.status === 'En attente' ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-red-100 text-red-600'
                                        }`}>
                                        <FiCreditCard size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{txn.ref}</p>
                                        <p className="text-xs text-gray-500">{txn.user}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">{txn.amount}</p>
                                    <p className={`text-xs font-medium ${txn.status === 'Succès' ? 'text-green-600' :
                                        txn.status === 'En attente' ? 'text-yellow-600' :
                                            'text-red-600'
                                        }`}>{txn.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Flux d'Activité</h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="relative">
                                <div className="h-8 w-8 rounded-full bg-blue-100 text-primary flex items-center justify-center">
                                    <FiUsers size={16} />
                                </div>
                                <div className="absolute top-8 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-gray-100" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-800"><span className="font-semibold text-gray-900">Nouvel utilisateur</span> inscrit : Paul Koffi</p>
                                <p className="text-xs text-gray-500">Il y a 2 heures</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative">
                                <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                    <FiDollarSign size={16} />
                                </div>
                                <div className="absolute top-8 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-gray-100" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-800"><span className="font-semibold text-gray-900">Transaction réussie</span> de 50,000 F via KKiapay</p>
                                <p className="text-xs text-gray-500">Il y a 3 heures</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="h-8 w-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                                <FiActivity size={16} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-800"><span className="font-semibold text-gray-900">Mise à jour système</span> : Maintenance terminée</p>
                                <p className="text-xs text-gray-500">Hier à 18:45</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

