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
        <div className="flex flex-col h-screen bg-[#f3f8ff] overflow-hidden">
            {/* Full Width Header */}
            <Header onMenuClick={() => setSidebarOpen(true)} />

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Desktop */}
                <aside className={`
                    hidden lg:block w-72 bg-[#2534C1] shadow-2xl z-30
                    transition-all duration-300
                `}>
                    <Sidebar />
                </aside>

                {/* Sidebar Mobile (Overlay) */}
                {isMobile && sidebarOpen && (
                    <>
                        <div
                            className="fixed inset-0 bg-primary/40 backdrop-blur-md z-40 transition-opacity"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <aside className="fixed inset-y-0 left-0 w-72 bg-primary z-50 transform transition-transform duration-300 shadow-2xl">
                            <Sidebar onClose={() => setSidebarOpen(false)} />
                        </aside>
                    </>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 scroll-smooth">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
