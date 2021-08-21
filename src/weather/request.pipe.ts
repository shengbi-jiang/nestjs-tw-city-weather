import { StringPipe } from '../infrastructure/pipes/string.pipe';

export const CityPipe = new StringPipe({
  maxLength: 63,
  minLength: 1,
});
