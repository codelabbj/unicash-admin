import React from 'react';
import { FiBattery, FiWifi, FiBarChart2 } from 'react-icons/fi';

const PhoneMockup = ({ children }) => {
    return (
        <div className="relative mx-auto h-[600px] w-[300px] overflow-hidden rounded-[2.5rem] border-[8px] border-gray-900 bg-white shadow-xl">
            {/* Notch */}
            <div className="absolute left-1/2 top-0 h-6 w-32 -translate-x-1/2 rounded-b-xl bg-gray-900 z-20"></div>

            {/* Status Bar */}
            <div className="absolute top-2 left-0 right-0 flex justify-between px-5 text-[10px] font-medium text-gray-900 z-10">
                <span>9:41</span>
                <div className="flex gap-1.5 items-center">
                    <FiBarChart2 size={10} className="transform rotate-90" />
                    <FiWifi size={10} />
                    <FiBattery size={10} />
                </div>
            </div>

            {/* Screen Content */}
            <div className="h-full w-full overflow-y-auto scrollbar-hide pt-8 bg-gray-50">
                {children}
            </div>

            {/* Home Indicator */}
            <div className="absolute bottom-1 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-gray-900 opacity-20"></div>
        </div>
    );
};

export default PhoneMockup;
