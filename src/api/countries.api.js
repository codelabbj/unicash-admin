// Mock API for countries

const mockCountries = [
    {
        id: 1,
        name: 'Bénin',
        code: 'BJ',
        currency: 'XOF',
        phoneCode: '+229',
        flag: 'https://flagcdn.com/w80/bj.png',
        isActive: true
    },
    {
        id: 2,
        name: 'Côte d\'Ivoire',
        code: 'CI',
        currency: 'XOF',
        phoneCode: '+225',
        flag: 'https://flagcdn.com/w80/ci.png',
        isActive: true
    },
    {
        id: 3,
        name: 'Sénégal',
        code: 'SN',
        currency: 'XOF',
        phoneCode: '+221',
        flag: 'https://flagcdn.com/w80/sn.png',
        isActive: true
    },
    {
        id: 4,
        name: 'Togo',
        code: 'TG',
        currency: 'XOF',
        phoneCode: '+228',
        flag: 'https://flagcdn.com/w80/tg.png',
        isActive: false
    }
];

export const countriesAPI = {
    getCountries: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: [...mockCountries] });
            }, 600);
        });
    },

    createCountry: async (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newCountry = {
                    id: mockCountries.length + 1,
                    ...data,
                    isActive: true,
                    // Simple logic to set flag if not provided, for demo purposes
                    flag: data.flag || `https://flagcdn.com/w80/${data.code.toLowerCase()}.png`
                };
                mockCountries.push(newCountry);
                resolve({ data: newCountry });
            }, 600);
        });
    },

    updateCountry: async (id, data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockCountries.findIndex(c => c.id === id);
                if (index !== -1) {
                    mockCountries[index] = { ...mockCountries[index], ...data };
                    resolve({ data: mockCountries[index] });
                }
            }, 600);
        });
    },

    deleteCountry: async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockCountries.findIndex(c => c.id === id);
                if (index !== -1) {
                    mockCountries.splice(index, 1);
                }
                resolve({ success: true });
            }, 500);
        });
    },

    toggleStatus: async (id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockCountries.findIndex(c => c.id === id);
                if (index !== -1) {
                    mockCountries[index].isActive = !mockCountries[index].isActive;
                    resolve({ data: mockCountries[index] });
                }
            }, 300);
        });
    }
};
