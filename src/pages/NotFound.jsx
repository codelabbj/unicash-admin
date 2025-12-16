import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
            <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
            <p className="text-xl text-gray-700 mb-8">Page non trouvée</p>
            <Link to="/admin" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Retour au tableau de bord
            </Link>
        </div>
    );
};

export default NotFound;
