import { NextFunction, Request, Response } from 'express';
import WeatherService from '@services/weathers.service';
import { Weather } from '@interfaces/weathers.interface';
import AddressService from '@services/addresses.service';
import { plainToClass } from "class-transformer";
import { CreateAddressesDto } from '@dtos/addresses.dto';

class WeatherController {
  public weatherService = new WeatherService();
  public addressService = new AddressService();

  public currentWeatherLatLon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const street = req.body.street;
      const streetNumber = req.body.streetNumber;
      const town = req.body.town;
      const postalCode = req.body.postalCode;
      const country = req.body.country;
      const address = plainToClass(CreateAddressesDto, { street, streetNumber, town, postalCode, country });

      const currentAddressData = await this.addressService.validateAddress(address);

      const currentWeatherData: Weather = await this.weatherService.getCurrentWeatherLatLon(
        currentAddressData.latitude,
        currentAddressData.longitude,
      );
      console.log(currentWeatherData);

      res.status(200).json({ data: currentWeatherData, message: 'current weather' });
    } catch (error) {
      next(error);
    }
  };

  public currentWeather = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const address = req.body.address;

      const currentWeatherData: Weather = await this.weatherService.getCurrentWeather(address);
      console.log(currentWeatherData);

      res.status(200).json({ data: currentWeatherData, message: 'current weather' });
    } catch (error) {
      next(error);
    }
  };
}

export default WeatherController;
