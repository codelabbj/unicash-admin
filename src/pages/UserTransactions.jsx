import React from 'react';
import { useParams } from 'react-router-dom';

const UserTransactions = () => {
    const { userId } = useParams();
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Transactions Utilisateur</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <p>Historique des transactions pour l'utilisateur {userId}.</p>
                <p className="mt-2 text-gray-500">Module en cours de développement.</p>
            </div>
        </div>
    );
};

export default UserTransactions;
