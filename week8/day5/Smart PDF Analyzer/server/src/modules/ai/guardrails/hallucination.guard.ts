import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class HallucinationGuard {
    validate(answer: string, context: string): void {
        // Basic logic: check if answer mentions things definitely not in context
        // This can be expanded with LLM-based verification
        if (!answer || answer.length < 5) return;

        // Simple mock logic for demonstration
        if (answer.toLowerCase().includes('hallucinate')) {
            throw new BadRequestException('Hallucination detected in AI output');
        }
    }
}
