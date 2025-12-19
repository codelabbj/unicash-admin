// Mock API for Users management

const mockUsers = [
    {
        id: 1,
        fullName: 'Jean Dupont',
        email: 'jean.dupont@gmail.com',
        phone: '+229 97 00 00 00',
        kycStatus: 'VERIFIED', // VERIFIED, PENDING, REJECTED, UNVERIFIED
        role: 'USER', // USER, AGENT, ADMIN
        status: 'ACTIVE', // ACTIVE, BLOCKED
        joinedAt: '2023-10-15T10:30:00Z',
        avatar: 'https://ui-avatars.com/api/?name=Jean+Dupont&background=0D8ABC&color=fff'
    },
    {
        id: 2,
        fullName: 'Marie Curis',
        email: 'marie.c@yahoo.fr',
        phone: '+229 66 11 22 33',
        kycStatus: 'PENDING',
        role: 'USER',
        status: 'ACTIVE',
        joinedAt: '2023-11-01T14:20:00Z',
        avatar: 'https://ui-avatars.com/api/?name=Marie+Curis&background=random'
    },
    {
        id: 3,
        fullName: 'Admin Test',
        email: 'admin@unicash.com',
        phone: '+229 90 90 90 90',
        kycStatus: 'VERIFIED',
        role: 'ADMIN',
        status: 'ACTIVE',
        joinedAt: '2023-01-01T00:00:00Z',
        avatar: 'https://ui-avatars.com/api/?name=Admin+Test&background=1e3a8a&color=fff'
    },
    {
        id: 4,
        fullName: 'Paul Koffi',
        email: 'paul.koffi@hotmail.com',
        phone: '+225 07 08 09 10',
        kycStatus: 'REJECTED',
        role: 'USER',
        status: 'BLOCKED', // Suspicious activity
        joinedAt: '2023-09-20T09:15:00Z',
        avatar: 'https://ui-avatars.com/api/?name=Paul+Koffi&background=random'
    }
];


export const usersAPI = {
    getUsers: async (filters = {}) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filtered = [...mockUsers];
                // Implement basic filtering if needed, e.g., by status or search
                if (filters.search) {
                    const lowerSearch = filters.search.toLowerCase();
                    filtered = filtered.filter(u =>
                        u.fullName.toLowerCase().includes(lowerSearch) ||
                        u.email.toLowerCase().includes(lowerSearch) ||
                        u.phone.includes(lowerSearch)
                    );
                }
                resolve({ data: filtered });
            }, 600);
        });
    },

    getUserById: async (id) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = mockUsers.find(u => u.id === id);
                if (user) resolve({ data: user });
                else reject({ message: 'User not found' });
            }, 400);
        });
    },

    updateUserStatus: async (id, status) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockUsers.findIndex(u => u.id === id);
                if (index !== -1) {
                    mockUsers[index].status = status;
                    resolve({ data: mockUsers[index] });
                }
            }, 500);
        });
    },

    updateUserRole: async (id, role) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockUsers.findIndex(u => u.id === id);
                if (index !== -1) {
                    mockUsers[index].role = role;
                    resolve({ data: mockUsers[index] });
                }
            }, 500);
        });
    }
};
