import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import AddressController from '@controllers/address.controller';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateAddressesDto } from '@dtos/addresses.dto';

class AddressRoute implements Routes {
  public path = '/';
  public router = Router();
  public addressController = new AddressController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}address`, validationMiddleware(CreateAddressesDto, 'body'), this.addressController.validateAddress);
  }
}

export default AddressRoute;
