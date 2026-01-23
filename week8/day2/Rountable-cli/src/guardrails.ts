import { z } from "zod";

/**
 * Guardrail to ensure the topic is work-related or safe for discussion.
 */
export const workRelatedGuardrail = {
    name: "workRelatedGuardrail",
    description: "Validates if the user input is professionally appropriate and safe.",
    // Guardrails in the SDK can be implemented as checks before or after a run
    validate: (input: string) => {
        const unsafeKeywords = ["illegal", "hate", "violence"];
        const lowerInput = input.toLowerCase();

        if (unsafeKeywords.some(keyword => lowerInput.includes(keyword))) {
            throw new Error("Input violates safety guardrails: inappropriate content detected.");
        }

        return input;
    }
};
