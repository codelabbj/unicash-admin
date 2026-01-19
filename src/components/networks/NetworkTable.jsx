import React, { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const LOGO_MAPPING = {
    'MTN': 'https://upload.wikimedia.org/wikipedia/commons/9/93/New-mtn-logo.jpg',
    'MOOV': 'https://upload.wikimedia.org/wikipedia/commons/2/22/Moov_Africa_logo.png',
    'ORANGE': 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Orange_logo.svg',
    'WAVE': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Wave_logo.svg/1200px-Wave_logo.svg.png',
    'CELTIIS': 'https://pbs.twimg.com/profile_images/1583486303038685186/tnk-aQq__400x400.jpg'
};

const getAutoLogo = (network) => {
    if (network.logo) return network.logo;

    const code = network.code?.toUpperCase() || '';
    const name = network.name?.toUpperCase() || '';

    if (code.includes('MTN') || name.includes('MTN')) return LOGO_MAPPING.MTN;
    if (code.includes('MOOV') || name.includes('MOOV')) return LOGO_MAPPING.MOOV;
    if (code.includes('ORANGE') || name.includes('ORANGE')) return LOGO_MAPPING.ORANGE;
    if (code.includes('WAVE') || name.includes('WAVE')) return LOGO_MAPPING.WAVE;
    if (code.includes('CELTIIS') || name.includes('CELTIIS') || code.includes('CELTIS')) return LOGO_MAPPING.CELTIIS;

    return null;
};

const NetworkLogo = ({ network }) => {
    const [imageError, setImageError] = useState(false);
    const logoUrl = getAutoLogo(network);

    if (logoUrl && !imageError) {
        return (
            <img
                src={logoUrl}
                alt={network.name}
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
            />
        );
    }

    return (
        <span className="text-lg font-bold text-primary">
            {network.name?.charAt(0).toUpperCase()}
        </span>
    );
};

const NetworkTable = ({ networks, countries = [], onEdit, onDelete, onToggleStatus }) => {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">Réseau</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">Pays</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">Statut</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {networks.map((network) => (
                            <tr key={network.uid} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-gray-100 bg-white shadow-sm flex items-center justify-center">
                                            <NetworkLogo network={network} />
                                        </div>
                                        <div className="text-sm font-semibold text-gray-900">{network.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <code className="rounded bg-gray-100 px-2 py-1 text-xs font-mono text-gray-600">
                                        {network.code}
                                    </code>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                        {countries.find(c => c.uid === network.country)?.name || network.country}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => onToggleStatus(network.uid)}
                                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${network.is_active
                                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        <span className={`h-1.5 w-1.5 rounded-full ${network.is_active ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                                        {network.is_active ? 'Actif' : 'Inactif'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(network)}
                                            className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            title="Modifier"
                                        >
                                            <FiEdit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(network.uid)}
                                            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                            title="Supprimer"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NetworkTable;
