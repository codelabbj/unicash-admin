import React from 'react';
import { FiPlus } from 'react-icons/fi';

const AddAggregatorCard = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-gray-200 bg-transparent hover:border-[#2534C1]/50 hover:bg-white/50 transition-all group min-h-[300px]"
        >
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center transition-transform group-hover:scale-110">
                <FiPlus className="text-[#2534C1] w-6 h-6 opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
                <h4 className="text-base font-bold text-gray-800">Ajouter une passerelle</h4>
                <p className="text-[10px] text-gray-400 mt-1 max-w-[150px]">
                    Connectez un nouveau fournisseur de paiement.
                </p>
            </div>
        </button>
    );
};

export default AddAggregatorCard;
