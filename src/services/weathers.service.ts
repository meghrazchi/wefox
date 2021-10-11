import { HttpException } from '@exceptions/HttpException';
import { Weather } from '@interfaces/weathers.interface';
import weatherModel from '@models/weathers.model';
import { isEmpty } from '@utils/util';
import { CreateWeathersDto } from '@dtos/weathers.dto';
import { fahrenheitToCelsius } from '@utils/temperature';
import axios from 'axios';
import { plainToClass } from 'class-transformer';
import AddressService from '@services/addresses.service';

class WeatherService {
  public weathers = weatherModel;
  public addressService = new AddressService();

  public async findAllWeather(): Promise<Weather[]> {
    const weathers: Weather[] = await this.weathers.find();
    return weathers;
  }

  public async getCurrentWeatherLatLon(lat: number, lon: number): Promise<Weather> {
    const weatherExists: Weather = await this.findWeatherByLatLonWithTime(lat, lon);
    if (weatherExists) {
      return weatherExists;
    }

    const apiKey = process.env.OPEN_WEATHER_MAP_API_KEY;
    const baseUrl = process.env.OPEN_WEATHER_MAP_BASE_URL;
    console.log(`${baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const res = await axios.get(`${baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
    console.log('Status Code:', res.status);
    console.log('Date in Response header:', headerDate);
    console.log('JSON Response:', res.data);

    const result = res.data;
    const latitude = result.coord.lat;
    const longitude = result.coord.lon;
    const temp = result.main.temp;
    const tempMin = result.main.temp_min;
    const tempMax = result.main.temp_max;
    const pressure = result.main.pressure;
    const humidity = result.main.humidity;

    const weather: Weather = await this.findWeatherByLatLon(lat, lon);
    const address = lat + ',' + lon;

    let newWeather;
    if (isEmpty(weather)) {
      newWeather = await this.createWeather(
        plainToClass(CreateWeathersDto, { address, latitude, longitude, temp, tempMin, tempMax, pressure, humidity }),
      );
    } else {
      newWeather = await this.updateWeather(
        address,
        plainToClass(CreateWeathersDto, { address, latitude, longitude, temp, tempMin, tempMax, pressure, humidity }),
      );
    }

    return newWeather;
  }

  public async getCurrentWeather(address: string): Promise<Weather> {
    const hours = 12;
    const date = new Date();
    const weatherExists: Weather = await this.findWeatherByAddressWithTime(address);
    if (weatherExists) {
      return weatherExists;
    }

    const apiKey = process.env.OPEN_WEATHER_MAP_API_KEY;
    const baseUrl = process.env.OPEN_WEATHER_MAP_BASE_URL;
    console.log(`${baseUrl}/weather?q=${address}&appid=${apiKey}`);
    const res = await axios.get(`${baseUrl}/weather?q=${address}&appid=${apiKey}`);
    const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
    console.log('Status Code:', res.status);
    console.log('Date in Response header:', headerDate);
    console.log('JSON Response:', res.data);

    const result = res.data;
    const latitude = result.coord.lat;
    const longitude = result.coord.lon;
    const temp = result.main.temp;
    const tempMin = result.main.temp_min;
    const tempMax = result.main.temp_max;
    const pressure = result.main.pressure;
    const humidity = result.main.humidity;

    const weather: Weather = await this.findWeatherByAddress(address);

    let newWeather;
    if (isEmpty(weather)) {
      newWeather = await this.createWeather(
        plainToClass(CreateWeathersDto, { address, latitude, longitude, temp, tempMin, tempMax, pressure, humidity }),
      );
    } else {
      newWeather = await this.updateWeather(
        address,
        plainToClass(CreateWeathersDto, { address, latitude, longitude, temp, tempMin, tempMax, pressure, humidity }),
      );
    }

    return newWeather;
  }

  public async findWeatherByAddress(address: string): Promise<Weather> {
    if (isEmpty(address)) throw new HttpException(400, 'Address should not be empty');

    const findWeather: Weather = await this.weathers.findOne({ address });

    return findWeather;
  }

  public async findWeatherByLatLon(latitude: number, longitude: number): Promise<Weather> {
    if (isEmpty(latitude) || isEmpty(longitude)) throw new HttpException(400, 'latitude and longitude should not be empty');

    const findWeather: Weather = await this.weathers.findOne({ latitude, longitude });

    return findWeather;
  }

  public async findWeatherByAddressWithTime(address): Promise<Weather> {
    if (isEmpty(address)) throw new HttpException(400, 'Address should not be empty');

    const hours = 12;
    const date = new Date();
    const findWeather: Weather = await this.weathers.findOne({ address, time: { $gte: new Date(date.getTime() - hours * 60 * 60 * 1000) } });

    return findWeather;
  }

  public async findWeatherByLatLonWithTime(latitude: number, longitude: number): Promise<Weather> {
    if (isEmpty(latitude) || isEmpty(longitude)) throw new HttpException(400, 'latitude and lon longitude not be empty');

    const hours = 12;
    const date = new Date();
    const findWeather: Weather = await this.weathers.findOne({
      latitude,
      longitude,
      time: { $gte: new Date(date.getTime() - hours * 60 * 60 * 1000) },
    });

    return findWeather;
  }

  public async createWeather(weatherData: CreateWeathersDto): Promise<Weather> {
    if (isEmpty(weatherData)) throw new HttpException(400, 'Weather data is not valid');

    console.log('-==-=-=--==-=-=--==-', weatherData);

    const findWeather: Weather = await this.weathers.findOne({ latitude: weatherData.latitude, longitude: weatherData.longitude });
    if (findWeather) throw new HttpException(409, `You're address ${weatherData.address} already exists`);

    const temp = fahrenheitToCelsius(weatherData.temp);
    const tempMax = fahrenheitToCelsius(weatherData.tempMax);
    const tempMin = fahrenheitToCelsius(weatherData.tempMin);

    const createWeatherData: Weather = await this.weathers.create({
      ...weatherData,
      temp,
      tempMax,
      tempMin,
      time: Date.now(),
    });

    return createWeatherData;
  }

  public async updateWeather(address: string, weatherData: CreateWeathersDto): Promise<Weather> {
    if (isEmpty(address) || isEmpty(weatherData) || weatherData.address != address) throw new HttpException(400, 'Weather data is not valid');

    const temp = fahrenheitToCelsius(weatherData.temp);
    const tempMax = fahrenheitToCelsius(weatherData.tempMax);
    const tempMin = fahrenheitToCelsius(weatherData.tempMin);

    const updateUserById: Weather = await this.weathers.findOneAndUpdate(
      { address },
      { userData: { ...weatherData, temp, tempMax, tempMin, time: Date.now() } },
    );

    if (!updateUserById) throw new HttpException(409, 'Weather update is failed');

    return updateUserById;
  }

  public async deleteWeather(address: string): Promise<Weather> {
    const deleteWeatherByAddress: Weather = await this.weathers.findOneAndDelete({ address });
    if (!deleteWeatherByAddress) throw new HttpException(409, 'Weather delete is failed');

    return deleteWeatherByAddress;
  }
}

export default WeatherService;
