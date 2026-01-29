import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ResearchDocument, ResearchDocumentSchema } from "./schemas/document.schema";
import { DocumentsService } from "./documents.service";
import { DocumentsController } from "./documents.controller";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: ResearchDocument.name, schema: ResearchDocumentSchema }]),
    ],
    controllers: [DocumentsController],
    providers: [DocumentsService],
    exports: [DocumentsService]
})
export class DocumentsModule { }