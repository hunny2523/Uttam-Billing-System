import { useState, useCallback } from 'react';

export const useContactPicker = () => {
    const [isSupported, setIsSupported] = useState(
        'contacts' in navigator && 'ContactsManager' in window
    );

    const pickContact = useCallback(async (options = {}) => {
        if (!isSupported) {
            throw new Error('Contact Picker API is not supported in this browser');
        }

        try {
            const props = options.properties || ['name', 'tel'];
            const opts = { multiple: options.multiple || false };

            const contacts = await navigator.contacts.select(props, opts);

            // Format contacts for easier use
            const formattedContacts = contacts.map(contact => ({
                name: contact.name?.[0] || '',
                phone: contact.tel?.[0] || '',
                email: contact.email?.[0] || '',
                rawContact: contact
            }));

            return options.multiple ? formattedContacts : formattedContacts[0];
        } catch (error) {
            if (error.name === 'AbortError') {
                // User cancelled the picker
                return null;
            }
            throw error;
        }
    }, [isSupported]);

    return {
        isSupported,
        pickContact
    };
};
