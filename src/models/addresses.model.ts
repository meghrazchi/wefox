import { model, Schema, Document } from 'mongoose';
import { Address } from '@interfaces/addresses.interface';

const addressSchema: Schema = new Schema({
  street: {
    type: String,
    required: true,
  },
  streetNumber: {
    type: String,
    required: true,
  },
  town: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const addressModel = model<Address & Document>('Address', addressSchema);

export default addressModel;
