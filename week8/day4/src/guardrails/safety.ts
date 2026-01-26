/**
 * Guardrail to ensure the topic is work-related or safe for discussion.
 */
export const workRelatedGuardrail = {
    name: "workRelatedGuardrail",
    description: "Validates if the user input is professionally appropriate and safe.",
    validate: (input: string) => {
        const unsafeKeywords = [
            "illegal", "hate", "violence", "spam", "hack", "crack",
            "exploit", "weapon", "drugs", "abuse", "terror",
        ];
        const lowerInput = input.toLowerCase();

        if (unsafeKeywords.some(keyword => lowerInput.includes(keyword))) {
            throw new Error("Input violates safety guardrails: inappropriate content detected.");
        }

        return input;
    }
};
