import React from 'react';
import { FiAlertTriangle, FiInfo, FiCheckCircle } from 'react-icons/fi';
import Modal from './Modal';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmer",
    cancelText = "Annuler",
    variant = "danger", // danger, warning, info
    isLoading = false
}) => {

    const getIcon = () => {
        switch (variant) {
            case 'danger': return <FiAlertTriangle className="text-rose-500" />;
            case 'warning': return <FiAlertTriangle className="text-amber-500" />;
            case 'success': return <FiCheckCircle className="text-emerald-500" />;
            default: return <FiInfo className="text-blue-500" />;
        }
    };

    const getButtonColor = () => {
        switch (variant) {
            case 'danger': return 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500';
            case 'warning': return 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500';
            case 'success': return 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500';
            default: return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            icon={getIcon()}
            size="sm"
        >
            <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                    {message}
                </p>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg shadow-gray-200 transition-all ${getButtonColor()} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Traitement...' : confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
