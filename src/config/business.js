// Parse contacts from environment variable or use default
const parseContacts = () => {
    try {
        const contactsJson = import.meta.env.VITE_CONTACTS;
        if (contactsJson) {
            const parsed = JSON.parse(contactsJson);
            // Ensure it's an array
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (error) {
        console.error('Error parsing VITE_CONTACTS:', error);
    }

    // Default contacts - always return an array
    return [
        {
            name: 'Dilip Patel',
            phone: '9898070258'
        },
        {
            name: 'Asha Patel',
            phone: '9409408456'
        }
    ];
};

export const BUSINESS_CONFIG = {
    name: import.meta.env.VITE_BUSINESS_NAME || 'Uttam Masala',
    fullName: import.meta.env.VITE_BUSINESS_FULL_NAME || 'Uttam Masala',
    shortName: import.meta.env.VITE_BUSINESS_SHORT_NAME || 'Uttam Masala',
    description: import.meta.env.VITE_BUSINESS_DESCRIPTION || 'Efficient billing and item management application',
    address: import.meta.env.VITE_BUSINESS_ADDRESS || 'Ahmedabad–Kalol Highway, Shertha, Gandhinagar – 382423',

    // Contact Information - Array of contacts (guaranteed to be an array)
    contacts: parseContacts(),

    // For backward compatibility
    phone: parseContacts()[0]?.phone || '9898070258',

    // Theme Configuration - supports: red, blue, green, orange, purple, indigo, pink, teal
    themeColor: import.meta.env.VITE_THEME_COLOR || 'red',
};
