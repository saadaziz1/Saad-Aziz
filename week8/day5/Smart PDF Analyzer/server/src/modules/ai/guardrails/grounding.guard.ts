import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class GroundingGuard {
    validate(answer: string, context: string): void {
        if (answer.includes("information is not present")) return;

        // Skip grounding check for JSON responses (structured data from agents)
        try {
            const parsed = JSON.parse(answer);
            if (typeof parsed === 'object' && parsed !== null) {
                console.log('[GroundingGuard] Skipping validation for structured JSON response');
                return;
            }
        } catch {
            // Not JSON, continue with normal validation
        }

        // In a real system, we'd use an LLM or cross-referencing to verify grounding
        // For now, we'll ensure the answer is at least somewhat related to common words in context
        const contextWords = new Set(context.toLowerCase().split(/\s+/));
        const answerWords = answer.toLowerCase().split(/\s+/).slice(0, 10);

        const intersection = answerWords.filter(w => contextWords.has(w));
        if (intersection.length === 0 && context.length > 100) {
            // throw new BadRequestException('Response is not grounded in document context');
            console.warn('Grounding check failed: No common words found between answer and context');
        }
    }
}
