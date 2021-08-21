export interface Parameter {
  parameterName: string;
  parameterValue: string;
  parameterUnit: string;
}

export interface Time {
  startTime: string;
  endTime: string;
  parameter: Parameter;
}

export interface WeatherElement {
  elementName: string;
  time: Time[];
}

export interface Location {
  locationName: string;
  weatherElement: WeatherElement[];
}

export interface WeatherResponseResult {
  locations: Location[];
}
