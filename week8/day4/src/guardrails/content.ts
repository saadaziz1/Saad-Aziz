/**
 * Guardrail to ensure input is not empty.
 */
export const emptyInputGuardrail = {
    name: "emptyInputGuardrail",
    description: "Prevents processing of empty or whitespace-only strings.",
    validate: (input: string) => {
        if (!input || input.trim().length === 0) {
            throw new Error("Input cannot be empty.");
        }
        return input;
    }
};

/**
 * Guardrail to limit maximum input length.
 */
export const lengthGuardrail = {
    name: "lengthGuardrail",
    description: "Limits the maximum length of user input to prevent token waste.",
    validate: (input: string, maxLength: number = 500) => {
        if (input.length > maxLength) {
            throw new Error(`Input is too long (maximum ${maxLength} characters).`);
        }
        return input;
    }
};
