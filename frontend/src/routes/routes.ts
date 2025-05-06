import path from "path";

export const ROUTES = {
    LANDINGS: {
        path: '/',
        label: 'Landing'
    },
    HOME: {
        path: '/home',
        label: 'Home'
    },
    PETS: {
        path: '/pets',
        label: 'Pets'
    },
    HEALTHCARE: {
        path: '/healthcare',
        label: 'Healthcare'
    },
    SERVICES: {
        path: '/services',
        label: 'Services'
    },
    PROFILE: {
        path: '/profile',
        label: 'Profile'
    },
    SETTINGS: {
        path: '/settings',
        label: 'Settings'
    },
    FEES: {
        path: '/vet/fees',
        label: 'Fees'        
    },
    VET_PORTAL: {
        path: '/vetportal',
        label: 'Vet Portal'
    },
    PAYMENTS: {
        path: '/payments',
        label: 'Payments'
    },
    // Vet-specific routes
    VET: {
        HOME: {
            path: '/vet/home',
            label: 'Home'
        },
        PETS: {
            path: '/vet/pets',
            label: 'Pets'
        },
        HEALTHCARE: {
            path: '/vet/healthcare',
            label: 'Healthcare'
        },
        SERVICES: {
            path: '/vet/services',
            label: 'Services'
        },
        PROFILE: {
            path: '/vet/profile',
            label: 'Profile'
        },
        SETTINGS: {
            path: '/vet/settings',
            label: 'Settings'
        },
    }
} as const;
