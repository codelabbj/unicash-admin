import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

const GlassSelect = ({ value, onChange, options, placeholder = "Sélectionner", className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange({ target: { value: optionValue } }); // Mimic event for compatibility
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-700 hover:border-slate-300 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm text-sm font-medium ${isOpen ? 'ring-4 ring-blue-500/10 border-blue-500' : ''}`}
            >
                <span className="truncate">
                    {selectedOption ? selectedOption.label : <span className="text-slate-400">{placeholder}</span>}
                </span>
                <FiChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 overflow-hidden bg-white/90 backdrop-blur-xl border border-white/60 rounded-xl shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200 origin-top">
                    <div className="max-h-60 overflow-y-auto py-1 scroll-smooth">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelect(option.value)}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left
                                    ${value === option.value ? 'bg-blue-50/50 text-blue-600 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <span className="truncate">{option.label}</span>
                                {value === option.value && <FiCheck className="w-4 h-4 text-blue-600" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlassSelect;
