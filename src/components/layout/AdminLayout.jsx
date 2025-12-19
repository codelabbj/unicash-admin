import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar Desktop */}
            <aside className={`
        hidden md:block w-64 bg-white shadow-lg
        transition-all duration-300
      `}>
                <Sidebar />
            </aside>

            {/* Sidebar Mobile (Overlay) */}
            {isMobile && sidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 transform transition-transform">
                        <Sidebar onClose={() => setSidebarOpen(false)} />
                    </aside>
                </>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            {isMobile && <MobileNav />}
        </div>
    );
};

export default AdminLayout;
