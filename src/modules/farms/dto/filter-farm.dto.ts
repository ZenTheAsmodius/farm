import { IsEnum, IsOptional, IsBoolean } from "class-validator";

export enum SortFarmEnum {
  NAME = "name",
  DATE = "createdAt",
  DISTANCE = "distance"
}

export class FilterFarmDto {
  @IsEnum(SortFarmEnum)
  @IsOptional()
  public orderBy: SortFarmEnum = SortFarmEnum.NAME;

  @IsBoolean()
  @IsOptional()
  public outliers: boolean = false;
}
