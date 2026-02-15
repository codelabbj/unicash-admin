import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

const CustomSelect = ({ label, value, options, onChange, icon: Icon, disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (option) => {
        if (disabled) return;
        onChange(option.value);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            {label && (
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-3">
                    {label}
                </div>
            )}

            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between rounded-2xl border bg-white py-3 px-4 text-[14px] font-black transition-all shadow-sm ${isOpen
                        ? 'border-primary ring-4 ring-primary/10'
                        : 'border-slate-200 hover:border-slate-300'
                    } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <div className="flex items-center gap-3">
                    {Icon && <div className="text-slate-400"><Icon size={18} /></div>}
                    <span className="text-slate-700">{selectedOption?.label}</span>
                </div>
                <div className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <FiChevronDown size={16} />
                </div>
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-1.5 space-y-0.5">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelect(option)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-bold transition-colors ${value === option.value
                                        ? 'bg-primary/5 text-primary'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <span>{option.label}</span>
                                {value === option.value && <FiCheck size={14} />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
