import React from 'react';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({
    title = 'Aucune donnée',
    description = 'Il n\'y a rien à afficher pour le moment.',
    icon,
    action
}) => {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-8 md:p-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100 text-gray-400">
                {icon ? React.cloneElement(icon, { size: 32 }) : <FiInbox size={32} />}
            </div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">{title}</h3>
            <p className="mb-6 max-w-sm text-sm text-gray-500">{description}</p>
            {action && (
                <div className="flex gap-3">
                    {action}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
