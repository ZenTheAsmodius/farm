import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

export class CreateUserDtoV2 extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  public address: string;
}
