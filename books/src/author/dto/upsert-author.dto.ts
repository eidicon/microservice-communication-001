import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpsertAuthorDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsMongoId()
  _id: string;
}
