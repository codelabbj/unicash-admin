import React from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

// Helper to extract page number from URL
const getPageFromUrl = (url) => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        const page = urlObj.searchParams.get('page');
        return page ? parseInt(page, 10) : 1;
    } catch {
        return null;
    }
};

const Pagination = ({ 
    currentPage, 
    totalPages, 
    totalItems, 
    itemsPerPage, 
    onPageChange,
    hasNext,
    hasPrevious,
    showInfo = true 
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white/40 backdrop-blur-md border border-white/60 rounded-[1.5rem] shadow-lg shadow-slate-200/30">
            {showInfo && (
                <div className="text-[13px] font-bold text-slate-500">
                    Affichage de <span className="text-slate-900 font-black">{startItem}</span> à{' '}
                    <span className="text-slate-900 font-black">{endItem}</span> sur{' '}
                    <span className="text-slate-900 font-black">{totalItems}</span> résultats
                </div>
            )}
            
            <div className="flex items-center gap-2">
                {/* First Page */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-xl transition-all ${
                        currentPage === 1 
                            ? 'text-slate-300 cursor-not-allowed' 
                            : 'text-slate-600 hover:bg-white hover:shadow-md hover:text-blue-600'
                    }`}
                >
                    <FiChevronsLeft size={18} />
                </button>

                {/* Previous Page */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!hasPrevious}
                    className={`p-2 rounded-xl transition-all ${
                        !hasPrevious 
                            ? 'text-slate-300 cursor-not-allowed' 
                            : 'text-slate-600 hover:bg-white hover:shadow-md hover:text-blue-600'
                    }`}
                >
                    <FiChevronLeft size={18} />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="px-3 py-2 text-[13px] font-bold text-slate-400">
                                    ...
                                </span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(page)}
                                    className={`min-w-[40px] h-10 px-3 rounded-xl text-[13px] font-black transition-all ${
                                        currentPage === page
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                            : 'text-slate-600 hover:bg-white hover:shadow-md hover:text-blue-600'
                                    }`}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Next Page */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!hasNext}
                    className={`p-2 rounded-xl transition-all ${
                        !hasNext 
                            ? 'text-slate-300 cursor-not-allowed' 
                            : 'text-slate-600 hover:bg-white hover:shadow-md hover:text-blue-600'
                    }`}
                >
                    <FiChevronRight size={18} />
                </button>

                {/* Last Page */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={!hasNext}
                    className={`p-2 rounded-xl transition-all ${
                        !hasNext 
                            ? 'text-slate-300 cursor-not-allowed' 
                            : 'text-slate-600 hover:bg-white hover:shadow-md hover:text-blue-600'
                    }`}
                >
                    <FiChevronsRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
