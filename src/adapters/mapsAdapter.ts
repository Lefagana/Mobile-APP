export interface GeocodeRequest {
  address: string;
}

export interface GeocodeResponse {
  lat: number;
  lng: number;
  formatted_address: string;
  place_id?: string;
}

export interface ReverseGeocodeRequest {
  lat: number;
  lng: number;
}

export interface ReverseGeocodeResponse {
  formatted_address: string;
  components?: {
    street?: string;
    area?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
  place_id?: string;
}

export interface AddressSuggestion {
  description: string;
  place_id: string;
  formatted_address?: string;
}

export interface IMapsAdapter {
  /**
   * Convert address string to coordinates
   */
  geocode(request: GeocodeRequest): Promise<GeocodeResponse>;

  /**
   * Convert coordinates to address string
   */
  reverseGeocode(request: ReverseGeocodeRequest): Promise<ReverseGeocodeResponse>;

  /**
   * Get address suggestions/autocomplete
   */
  getAddressSuggestions(query: string, location?: { lat: number; lng: number }): Promise<AddressSuggestion[]>;
}

// Export adapter instance (will be set based on environment)
export let mapsAdapter: IMapsAdapter;

export const setMapsAdapter = (impl: IMapsAdapter) => {
  mapsAdapter = impl;
};