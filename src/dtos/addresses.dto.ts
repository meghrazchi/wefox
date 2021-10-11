import { IsNumber, IsString } from 'class-validator';

export class CreateAddressesDto {
  @IsString()
  public street: string;

  @IsNumber()
  public streetNumber: number;

  @IsString()
  public town: string;

  @IsNumber()
  public postalCode: number;

  @IsString()
  public country: string;
}
