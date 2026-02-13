import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';


const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            {/* Full Width Header */}
            <Header onMenuClick={() => setSidebarOpen(true)} />

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Desktop */}
                <aside className={`
                    hidden lg:block w-64 bg-white border-r border-gray-100
                    transition-all duration-300
                `}>
                    <Sidebar />
                </aside>

                {/* Sidebar Mobile (Overlay) */}
                {isMobile && sidebarOpen && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <aside className="fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 shadow-2xl">
                            <Sidebar onClose={() => setSidebarOpen(false)} />
                        </aside>
                    </>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6 pb-20 scroll-smooth">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
