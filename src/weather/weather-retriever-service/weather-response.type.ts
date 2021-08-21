export interface Field {
  id: string;
  type: string;
}

export interface Result {
  resource_id: string;
  fields: Field[];
}

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

export interface Records {
  datasetDescription: string;
  location: Location[];
}

export interface WeatherResponse {
  success: string;
  result: Result;
  records: Records;
}
