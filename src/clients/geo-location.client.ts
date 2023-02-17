import config from "config/config";
import axios, { AxiosInstance } from "axios";
import https from "https";
import { GeoLocationClientError } from "errors/errors";

const {
  DISTANCE_MATRIX_URL,
  DISTANCE_MATRIX_KEY
} = config;


class GeoLocationClient {
  private client: AxiosInstance;
  private readonly accessToken: string;

  constructor() {
    this.accessToken = DISTANCE_MATRIX_KEY;
    this.client = axios.create({
      baseURL: DISTANCE_MATRIX_URL,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    })
    this.client.interceptors.response.use(
      (_) => {return _},
      (error) => {
        console.error(error)
        if (axios.isAxiosError(error)) {
          throw new GeoLocationClientError(error.message ?? error.response?.data)
        }
        throw error;
      }
    );
  }

  public async getAddressCoordinates(address: string) {
    const res = await this.client.get<CoordinatesByAddressResult>(`/geocode/json?address=${address}&key=${this.accessToken}`);
    const location = res.data.result[0].geometry.location;
    return `${location.lat},${location.lng}`;
  }

  public async getDistance(origin: string, destinations: string | Array<string>) {
    const dest = destinations instanceof Array ? destinations.join("|") : destinations;
    const res = await this.client.get<DistanceFromCoordinatesResult>(`/distancematrix/json?origins=${origin}&destinations=${dest}&key=${this.accessToken}`);
    return res.data.rows[0].elements;
  }
}

export default new GeoLocationClient()

interface Location {
  lat: number;
  lng: number;
}
interface CoordinatesByAddressResult {
  result: {
    address_components: {
      long_name: string;
      short_name: string;
      types: string[];
    }[];
    formatted_address: string;
    geometry: {
      location: Location;
      location_type: string;
      viewport: {
        northeast: Location;
        southwest: Location;
      };
    };
    place_id: string;
    plus_code: {};
    types: string[];
  }[];
  status: string;
}


export interface DistanceFromCoordinatesResult {
  destination_addresses: string[]
  origin_addresses: string[]
  rows: {
    elements: {
      distance: TextValue
      duration: TextValue
      origin: string
      destination: string
      status: string
    }[]
  }[]
  status: string
}

export interface TextValue {
  text: string
  value: number
}
