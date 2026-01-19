import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Chargement...' }) => {
    const sizeClasses = {
        sm: 'h-5 w-5 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4',
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className={`
                ${sizeClasses[size]}
                animate-spin rounded-full
                border-gray-200 border-t-primary
            `} />
            {text && <p className="mt-4 text-sm font-medium text-gray-500 animate-pulse">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
