import { model, Schema, Document } from 'mongoose';
import { Weather } from '@interfaces/weathers.interface';

const weatherSchema: Schema = new Schema({
  address: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  temp: {
    type: Number,
    required: true,
  },
  pressure: {
    type: Number,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  tempMin: {
    type: Number,
    required: true,
  },
  tempMax: {
    type: Number,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
});

const weatherModel = model<Weather & Document>('Weather', weatherSchema);

export default weatherModel;
