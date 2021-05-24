import { IsNotEmpty } from 'class-validator';

export class CreateAuthorDto {
  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly lastName: string;

  @IsNotEmpty()
  readonly age: number;

  @IsNotEmpty()
  readonly biography: string;

  @IsNotEmpty()
  readonly numberOfBooks: number;
}
