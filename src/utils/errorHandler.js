/**
 * Formats backend errors (usually from Django Rest Framework) into a human-readable string.
 * @param {any} error - The error object from axios or other sources.
 * @returns {string} - A formatted error message.
 */
export const formatErrorForDisplay = (error) => {
    if (!error) return "Une erreur inconnue est survenue.";

    // If it's already a string, just return it
    if (typeof error === 'string') return error;

    // Handle Axios error response
    if (error.response && error.response.data) {
        const data = error.response.data;

        // 1. Check for non_field_errors (common in Django Rest Framework)
        if (data.non_field_errors) {
            return Array.isArray(data.non_field_errors)
                ? data.non_field_errors.join(' ')
                : data.non_field_errors;
        }

        // 2. Check for 'detail' key
        if (data.detail) {
            return typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
        }

        // 3. Handle field-specific validation errors
        // e.g., { "email": ["This field is required."], "password": ["Too short."] }
        const errorEntries = Object.entries(data);
        if (errorEntries.length > 0) {
            const [field, messages] = errorEntries[0];
            if (Array.isArray(messages)) {
                // If it's a known field-based error, format as "Field: message" or just "message"
                // For login, we often just want the message.
                return `${messages.join(' ')}`;
            }
            if (typeof messages === 'string') return messages;
        }

        // 4. Fallback for other data structures
        if (typeof data === 'string') return data;
    }

    // 5. Handle standard Error object or custom message
    return error.message || "Une erreur est survenue lors de la communication avec le serveur.";
};
