import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UploadDocumentDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    filename: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    topic: string;
}
