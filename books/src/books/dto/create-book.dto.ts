import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsMongoId()
  authorId: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
