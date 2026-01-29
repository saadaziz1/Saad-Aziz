import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDocumentDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    title: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    topic: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(10000)
    content: string;
}
