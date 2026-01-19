import React, { useRef, useEffect } from 'react';
import { FiEdit2 } from 'react-icons/fi';
import clsx from 'clsx';

const SettingInput = ({ label, name, type = 'text', value, onChange, isEditing, onEditClick, className }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    return (
        <div className={className}>
            <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
            <div className="relative">
                <input
                    ref={inputRef}
                    type={type}
                    name={name}
                    value={value}
                    onChange={(e) => onChange(name, e.target.value)}
                    readOnly={!isEditing}
                    className={clsx(
                        "w-full rounded-xl border border-gray-200 py-2.5 pl-4 pr-10 text-sm transition-all duration-200",
                        "focus:outline-none focus:ring-1 focus:ring-primary",
                        isEditing
                            ? "bg-white border-primary ring-1 ring-primary shadow-sm"
                            : "bg-gray-50 text-gray-600 border-transparent cursor-default hover:bg-gray-100"
                    )}
                />
                {!isEditing && (
                    <button
                        type="button"
                        onClick={() => onEditClick(name)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-primary hover:bg-white rounded-lg transition-all"
                        title="Modifier"
                    >
                        <FiEdit2 size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SettingInput;
