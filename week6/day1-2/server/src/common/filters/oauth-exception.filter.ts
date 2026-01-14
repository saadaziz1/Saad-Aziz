import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(UnauthorizedException, ForbiddenException)
export class OAuthExceptionFilter implements ExceptionFilter {
    catch(exception: UnauthorizedException | ForbiddenException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        // Redirect to login page with error query param
        response.redirect(`${frontendUrl}/login?error=OAuthFailed`);
    }
}
