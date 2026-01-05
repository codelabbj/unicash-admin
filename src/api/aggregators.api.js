// Mock API for Payment Aggregators
import fedapayLogo from '../assets/fedapay.png';
import kkiapayLogo from '../assets/kkiapay.jpg';

const mockAggregators = [
    {
        id: 1,
        name: 'Fedapay',
        code: 'FEDAPAY',
        isActive: true,
        logo: fedapayLogo
    },
    {
        id: 2,
        name: 'KKiapay',
        code: 'KKIAPAY',
        isActive: true,
        logo: kkiapayLogo
    },
    {
        id: 3,
        name: 'CinetPay',
        code: 'CINETPAY',
        isActive: false,
        logo: 'https://cinetpay.com/img/cinetpay-logo.png'
    }
];

export const aggregatorsAPI = {
    getAggregators: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: [...mockAggregators] });
            }, 600);
        });
    },

    createAggregator: async (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newAggregator = {
                    id: mockAggregators.length + 1,
                    ...data,
                    isActive: true
                };
                mockAggregators.push(newAggregator);
                resolve({ data: newAggregator });
            }, 600);
        });
    },

    updateAggregator: async (id, data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockAggregators.findIndex(a => a.id === id);
                if (index !== -1) {
                    mockAggregators[index] = { ...mockAggregators[index], ...data };
                    resolve({ data: mockAggregators[index] });
                }
            }, 600);
        });
    },

    deleteAggregator: async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockAggregators.findIndex(a => a.id === id);
                if (index !== -1) {
                    mockAggregators.splice(index, 1);
                }
                resolve({ success: true });
            }, 500);
        });
    },

    toggleStatus: async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockAggregators.findIndex(a => a.id === id);
                if (index !== -1) {
                    mockAggregators[index].isActive = !mockAggregators[index].isActive;
                    resolve({ data: mockAggregators[index] });
                }
            }, 300);
        });
    }
};
