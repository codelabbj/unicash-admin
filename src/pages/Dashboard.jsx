import React from 'react';
import { FiDollarSign, FiUsers, FiCreditCard, FiActivity } from 'react-icons/fi';
import StatCard from '../components/dashboard/StatCard';

const Dashboard = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Volume Total"
                    value="15 245 000 F"
                    icon={FiDollarSign}
                    trend={12}
                    color="blue"
                />
                <StatCard
                    title="Utilisateurs"
                    value="1,234"
                    icon={FiUsers}
                    trend={5.4}
                    color="green"
                />
                <StatCard
                    title="Transactions"
                    value="856"
                    icon={FiCreditCard}
                    trend={-2.3}
                    color="yellow"
                />
                <StatCard
                    title="Frais Collectés"
                    value="450 000 F"
                    icon={FiActivity}
                    trend={8.1}
                    color="red"
                />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Aperçu récent</h2>
                <p className="text-gray-500">Graphiques et détails à venir...</p>
            </div>
        </div>
    );
};

export default Dashboard;
