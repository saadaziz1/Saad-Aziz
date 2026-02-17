// Match Solidity contract constants
export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 1000;

export function validateTaskInput(title: string, description: string): { valid: boolean; error?: string } {
    const titleLength = title.trim().length;
    const descriptionLength = description.trim().length;

    if (titleLength === 0) {
        return { valid: false, error: 'Title cannot be empty' };
    }

    if (titleLength > MAX_TITLE_LENGTH) {
        return { valid: false, error: `Title must be ${MAX_TITLE_LENGTH} characters or less` };
    }

    if (descriptionLength > MAX_DESCRIPTION_LENGTH) {
        return { valid: false, error: `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less` };
    }

    return { valid: true };
}
