import apiClient from './axios.config';

// Mock data to simulate backend until ready
let mockBanners = [
    {
        id: 1,
        title: "Envoyez plus, payez moins",
        description: "Frais réduits sur tous vos transferts vers Moov, Mtn ou Celtiis.",
        image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=1000&auto=format&fit=crop",
        link: "#",
        isActive: true
    },
    {
        id: 2,
        title: "Faites vos transactions sans bouger",
        description: "Faites vos transactions sans bouger de votre lit.",
        image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1000&auto=format&fit=crop",
        link: "#",
        isActive: true
    },
    {
        id: 3,
        title: "Faites vos transactions en toute sécurité",
        description: "Faites vos transactions en toute sécurité avec UniCash.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000&auto=format&fit=crop",
        link: "#",
        isActive: false
    }
];

export const bannersAPI = {
    getBanners: async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return { data: mockBanners };
    },

    createBanner: async (data) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newBanner = { ...data, id: Date.now(), isActive: true };
        mockBanners.push(newBanner);
        return { data: newBanner };
    },

    updateBanner: async (id, data) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = mockBanners.findIndex(b => b.id === id);
        if (index !== -1) {
            mockBanners[index] = { ...mockBanners[index], ...data };
            return { data: mockBanners[index] };
        }
        throw new Error("Banner not found");
    },

    deleteBanner: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        mockBanners = mockBanners.filter(b => b.id !== id);
        return { message: "Deleted successfully" };
    },

    toggleStatus: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = mockBanners.findIndex(b => b.id === id);
        if (index !== -1) {
            mockBanners[index].isActive = !mockBanners[index].isActive;
            return { data: mockBanners[index] };
        }
        throw new Error("Banner not found");
    }
};
