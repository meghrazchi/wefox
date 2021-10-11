import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';
import WeatherController from '@controllers/weather.controller';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateAddressesDto } from '@dtos/addresses.dto';

class AuthRoute implements Routes {
  public path = '/weather';
  public router = Router();
  public weatherController = new WeatherController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, [authMiddleware, validationMiddleware(CreateAddressesDto, 'body')], this.weatherController.currentWeatherLatLon);
    this.router.post(`${this.path}/current`, authMiddleware, this.weatherController.currentWeather);
  }
}

export default AuthRoute;
