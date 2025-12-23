"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    const port = process.env.PORT || 5000;
    const server = await app.listen(port, '0.0.0.0');
    console.log(`🚀 Server running on port ${port}`);
    process.on('SIGTERM', async () => {
        console.log('SIGTERM received, shutting down gracefully');
        await app.close();
        server.close();
        process.exit(0);
    });
    process.on('SIGINT', async () => {
        console.log('SIGINT received, shutting down gracefully');
        await app.close();
        server.close();
        process.exit(0);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map