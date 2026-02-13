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
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar Desktop */}
            <aside className={`
                hidden lg:block w-60 h-screen p-3
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
                    <aside className="fixed inset-y-0 left-0 w-64 p-3 z-50 transform transition-transform duration-300">
                        <Sidebar onClose={() => setSidebarOpen(false)} />
                    </aside>
                </>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-3 md:p-5 lg:p-6 pb-20 md:pb-5 scroll-smooth">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
