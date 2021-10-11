export interface Weather {
  _id: string;
  address: string;
  latitude: number;
  longitude: number;
  temp: number;
  pressure: number;
  humidity: number;
  temp_min: number;
  temp_max: number;
  time: Date;
}
