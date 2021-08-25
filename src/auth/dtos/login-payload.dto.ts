import { IsString, MaxLength } from 'class-validator';

export class LoginPayloadDto {
  @MaxLength(255)
  @IsString()
  username: string;

  @MaxLength(255)
  @IsString()
  password: string;
}
