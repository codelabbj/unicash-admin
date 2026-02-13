import React, { useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const LOGO_MAPPING = {
    'MTN': 'https://upload.wikimedia.org/wikipedia/commons/9/93/New-mtn-logo.jpg',
    'MOOV': 'https://upload.wikimedia.org/wikipedia/commons/2/22/Moov_Africa_logo.png',
    'ORANGE': 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Orange_logo.svg',
    'WAVE': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Wave_logo.svg/1200px-Wave_logo.svg.png',
    'CELTIIS': 'https://pbs.twimg.com/profile_images/1583486303038685186/tnk-aQq__400x400.jpg',
    'VODAFONE': 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Vodafone_2017_logo.svg' // Added extra
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
    if (code.includes('VODAFONE') || name.includes('VODAFONE')) return LOGO_MAPPING.VODAFONE;

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
        <span className="text-lg font-bold text-slate-700">
            {network.name?.charAt(0).toUpperCase()}
        </span>
    );
};

const ToggleSwitch = ({ checked, onChange }) => (
    <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${checked ? 'bg-primary' : 'bg-gray-200'
            }`}
    >
        <span
            className={`${checked ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
    </button>
);

const NetworkTable = ({ networks, countries = [], onEdit, onDelete, onToggleStatus }) => {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">OPÉRATEUR</th>
                            <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">PAYS</th>
                            <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">CODE RÉSEAU</th>
                            <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">TYPE DE SERVICE</th>
                            <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">STATUT</th>
                            <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-wider text-slate-400">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {networks.map((network) => {
                            const country = countries.find(c => c.uid === network.country);
                            return (
                                <tr key={network.uid} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm flex items-center justify-center p-1">
                                                <NetworkLogo network={network} />
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">{network.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {/* Minimalistic flag representation if no image available, using emoji if possible or just name */}
                                            {/* Assuming country object might have a flag url or iso code later. For now, simple text or emoji mapping could go here. */}
                                            <span className="text-sm font-medium text-slate-700">{country?.name || network.country}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                                            {network.code}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                                            Mobile Money
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <ToggleSwitch
                                            checked={network.is_active}
                                            onChange={() => onToggleStatus(network.uid)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <div className="flex justify-end gap-2 opacity-100">
                                            <button
                                                onClick={() => onEdit(network)}
                                                className="p-2 text-slate-400 hover:text-primary transition-colors"
                                                title="Modifier"
                                            >
                                                <FiEdit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(network.uid)}
                                                className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                                                title="Supprimer"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NetworkTable;
