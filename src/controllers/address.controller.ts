import { NextFunction, Request, Response } from 'express';
import AddressService from '@services/addresses.service';
import { Address } from '@interfaces/addresses.interface';
import { plainToClass } from 'class-transformer';
import { CreateAddressesDto } from '@dtos/addresses.dto';

class AddressController {
  public addressService = new AddressService();

  public validateAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const street = req.body.street;
      const streetNumber = req.body.streetNumber;
      const town = req.body.town;
      const postalCode = req.body.postalCode;
      const country = req.body.country;
      const address = plainToClass(CreateAddressesDto, { street, streetNumber, town, postalCode, country });

      const currentAddressData: Address = await this.addressService.validateAddress(address);

      res.status(200).json({ data: currentAddressData, message: 'address info' });
    } catch (error) {
      next(error);
    }
  };
}

export default AddressController;
