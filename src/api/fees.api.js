// Mock API for fee configurations

const mockFeeConfigs = [
    {
        id: 1,
        networkId: 1, // MTN Bénin
        networkName: 'MTN Bénin',
        minAmount: 0,
        maxAmount: 500000,
        fixedFee: 0,
        percentageFee: 1.0,
        isActive: true
    },
    {
        id: 2,
        networkId: 2, // Moov Bénin
        networkName: 'Moov Bénin',
        minAmount: 0,
        maxAmount: 2000000,
        fixedFee: 0,
        percentageFee: 1.0,
        isActive: true
    },
    {
        id: 3,
        networkId: 3, // Celtiis
        networkName: 'Celtiis',
        minAmount: 0,
        maxAmount: 1000000,
        fixedFee: 0,
        percentageFee: 0.8,
        isActive: true
    },
    {
        id: 4,
        networkId: null, // Default / All
        networkName: 'Tous Réseaux (Défaut)',
        minAmount: 0,
        maxAmount: null,
        fixedFee: 100,
        percentageFee: 1.5,
        isActive: false
    }
];

export const feesAPI = {
    getFeeConfigs: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: [...mockFeeConfigs] });
            }, 600);
        });
    },

    createFeeConfig: async (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newConfig = {
                    id: mockFeeConfigs.length + 1,
                    ...data,
                    isActive: true,
                    // Simulate looking up network name if networkId is provided
                    networkName: data.networkId
                        ? (data.networkId === 1 ? 'MTN Bénin' : data.networkId === 2 ? 'Moov Bénin' : 'Autre Réseau')
                        : 'Tous Réseaux'
                };
                mockFeeConfigs.push(newConfig);
                resolve({ data: newConfig });
            }, 600);
        });
    },

    updateFeeConfig: async (id, data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockFeeConfigs.findIndex(c => c.id === id);
                if (index !== -1) {
                    mockFeeConfigs[index] = { ...mockFeeConfigs[index], ...data };
                    // Simulate name update usually backend handles this join logic
                    resolve({ data: mockFeeConfigs[index] });
                }
            }, 600);
        });
    },

    deleteFeeConfig: async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockFeeConfigs.findIndex(c => c.id === id);
                if (index !== -1) {
                    mockFeeConfigs.splice(index, 1);
                }
                resolve({ success: true });
            }, 500);
        });
    },

    toggleStatus: async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockFeeConfigs.findIndex(c => c.id === id);
                if (index !== -1) {
                    mockFeeConfigs[index].isActive = !mockFeeConfigs[index].isActive;
                    resolve({ data: mockFeeConfigs[index] });
                }
            }, 300);
        });
    }
};
