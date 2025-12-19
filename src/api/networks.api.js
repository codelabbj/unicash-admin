// Mock API for networks
// In a real app, this would call your backend endpoints

import mtnLogo from '../assets/Mtn_Benin.png';
import moovLogo from '../assets/Moov_Benin.png';
import celtiisLogo from '../assets/Celtiis_Benin.png';

const mockNetworks = [
    {
        id: 1,
        name: 'MTN Bénin',
        code: 'MTN_BJ',
        country: 'BJ',
        logo: mtnLogo,
        isActive: true
    },
    {
        id: 2,
        name: 'Moov Bénin',
        code: 'MOOV_BJ',
        country: 'BJ',
        logo: moovLogo,
        isActive: true
    },
    {
        id: 3,
        name: 'Celtiis',
        code: 'CELTIIS_BJ',
        country: 'BJ',
        logo: celtiisLogo,
        isActive: true
    },
    {
        id: 4,
        name: 'Orange Côte d\'Ivoire',
        code: 'ORANGE_CI',
        country: 'CI',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/2048px-Orange_logo.svg.png',
        isActive: false
    }
];

export const networksAPI = {
    getNetworks: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: [...mockNetworks] });
            }, 600);
        });
    },

    createNetwork: async (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newNetwork = {
                    id: mockNetworks.length + 1,
                    ...data,
                    isActive: true
                };
                mockNetworks.push(newNetwork);
                resolve({ data: newNetwork });
            }, 600);
        });
    },

    updateNetwork: async (id, data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockNetworks.findIndex(n => n.id === id);
                if (index !== -1) {
                    mockNetworks[index] = { ...mockNetworks[index], ...data };
                    resolve({ data: mockNetworks[index] });
                }
            }, 600);
        });
    },

    deleteNetwork: async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockNetworks.findIndex(n => n.id === id);
                if (index !== -1) {
                    mockNetworks.splice(index, 1);
                }
                resolve({ success: true });
            }, 500);
        });
    },

    toggleStatus: async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockNetworks.findIndex(n => n.id === id);
                if (index !== -1) {
                    mockNetworks[index].isActive = !mockNetworks[index].isActive;
                    resolve({ data: mockNetworks[index] });
                }
            }, 300);
        });
    }
};
