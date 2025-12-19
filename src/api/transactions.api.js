// Mock API for Transactions

const mockTransactions = [
    {
        id: 'TXN-001',
        userId: 1,
        userName: 'Jean Dupont',
        senderNetwork: 'MTN_BJ',
        receiverNetwork: 'MOOV_BJ',
        amount: 5000,
        fee: 50,
        totalAmount: 5050,
        status: 'COMPLETED', // COMPLETED, PENDING, FAILED, PROCESSING
        type: 'TRANSFER',
        reference: 'UC-789-456',
        createdAt: '2023-12-18T10:00:00Z'
    },
    {
        id: 'TXN-002',
        userId: 2,
        userName: 'Marie Curis',
        senderNetwork: 'CELTIIS_BJ',
        receiverNetwork: 'ORANGE_CI',
        amount: 25000,
        fee: 250,
        totalAmount: 25250,
        status: 'PENDING',
        type: 'TRANSFER',
        reference: 'UC-123-456',
        createdAt: '2023-12-18T11:30:00Z'
    },
    {
        id: 'TXN-003',
        userId: 4,
        userName: 'Paul Koffi',
        senderNetwork: 'MTN_BJ',
        receiverNetwork: 'CELTIIS_BJ',
        amount: 2000,
        fee: 20,
        totalAmount: 2020,
        status: 'FAILED',
        type: 'TRANSFER',
        reference: 'UC-456-789',
        createdAt: '2023-12-17T09:15:00Z'
    }
];

export const transactionsAPI = {
    getTransactions: async (params = {}) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filtered = [...mockTransactions];
                if (params.status) {
                    filtered = filtered.filter(t => t.status === params.status);
                }
                if (params.search) {
                    const search = params.search.toLowerCase();
                    filtered = filtered.filter(t =>
                        t.reference.toLowerCase().includes(search) ||
                        t.userName.toLowerCase().includes(search)
                    );
                }
                resolve({ data: filtered });
            }, 600);
        });
    },

    updateTransactionStatus: async (id, status) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockTransactions.findIndex(t => t.id === id);
                if (index !== -1) {
                    mockTransactions[index].status = status;
                    resolve({ data: mockTransactions[index] });
                }
            }, 500);
        });
    }
};
