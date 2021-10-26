import axios from 'axios';
import { plainToClass } from 'class-transformer';
import addressModel from '@models/addresses.model';
import { Address } from '@interfaces/addresses.interface';
import { CreateAddressesDto } from '@dtos/addresses.dto';
import { HttpException } from '@exceptions/HttpException';

class AddressService {
  public addresses = addressModel;

  public async findAllWeather(): Promise<Address[]> {
    const addresses: Address[] = await this.addresses.find();
    return addresses;
  }

  public async validateAddress(addressData: CreateAddressesDto): Promise<T> {
    const address = addressData.streetNumber + ',' + addressData.street.replace(' ', '+') + ',' + addressData.town;

    const baseUrl = process.env.OPEN_STREET_MAP_BASE_URL;
    console.log(`${baseUrl}/search?q=${address}&format=json&polygon=1&addressdetails=1`);
    const res = await axios.get(`${baseUrl}/search?q=${address}&format=json&polygon=1&addressdetails=1`);
    const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
    console.log('Status Code:', res.status);
    console.log('Date in Response header:', headerDate);
    console.log('JSON Response:', res.data);

    const result = res.data;

    if (!result || result.length == 0) {
      throw new HttpException(404, 'address is not valid');
    }

    const addressInfo = result[0].address;
    const latitude = result[0].lat;
    const longitude = result[0].lon;

    const house_number = addressInfo.house_number;
    const road = addressInfo.road;
    const city = addressInfo.city;
    const country = addressInfo.country;
    const postcode = addressInfo.postcode;

    const addressObject = plainToClass(CreateAddressesDto, {
      street: road,
      streetNumber: house_number,
      city,
      country,
      postalCode: postcode,
      latitude,
      longitude,
    });

    return addressObject;
  }
}

export default AddressService;
