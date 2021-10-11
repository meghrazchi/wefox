import { IsNumber, IsString } from 'class-validator';

export class CreateWeathersDto {
  @IsString()
  public address: string;

  @IsNumber()
  public latitude: number;

  @IsNumber()
  public longitude: number;

  @IsNumber()
  public temp: number;

  @IsNumber()
  public pressure: number;

  @IsNumber()
  public humidity: number;

  @IsNumber()
  public tempMin: number;

  @IsNumber()
  public tempMax: number;

  @IsNumber()
  public time: Date;
}
