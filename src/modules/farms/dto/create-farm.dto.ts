import { IsDecimal, IsNotEmpty, IsString } from "class-validator";

export class CreateFarmDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public address: string;

  @IsDecimal()
  @IsNotEmpty()
  public size: number;

  @IsDecimal()
  @IsNotEmpty()
  public yield: number;

}
