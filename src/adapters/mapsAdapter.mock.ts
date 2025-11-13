import type {
  IMapsAdapter,
  GeocodeRequest,
  GeocodeResponse,
  ReverseGeocodeRequest,
  ReverseGeocodeResponse,
  AddressSuggestion,
} from './mapsAdapter';

/**
 * Mock Maps Adapter
 * Simulates geocoding and reverse geocoding for development and testing
 * Uses common Nigerian locations
 */

// Mock location database
const mockLocations: Record<string, { lat: number; lng: number; formatted: string }> = {
  'wuse market, abuja': {
    lat: 9.0765,
    lng: 7.3986,
    formatted: 'Wuse Market, Abuja, FCT, Nigeria',
  },
  'ikeja, lagos': {
    lat: 6.5244,
    lng: 3.3792,
    formatted: 'Ikeja, Lagos State, Nigeria',
  },
  'victoria island, lagos': {
    lat: 6.4281,
    lng: 3.4219,
    formatted: 'Victoria Island, Lagos, Nigeria',
  },
  'garki, abuja': {
    lat: 9.05,
    lng: 7.5,
    formatted: 'Garki, Abuja, FCT, Nigeria',
  },
  'kano': {
    lat: 11.9962,
    lng: 8.5167,
    formatted: 'Kano, Kano State, Nigeria',
  },
  'port harcourt': {
    lat: 4.8156,
    lng: 7.0498,
    formatted: 'Port Harcourt, Rivers State, Nigeria',
  },
};

export const mapsAdapterMock: IMapsAdapter = {
  geocode: async (request: GeocodeRequest): Promise<GeocodeResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const query = request.address.toLowerCase().trim();

    // Try to find exact match
    const location = mockLocations[query];

    if (location) {
      console.log('[MOCK Maps] Geocode result:', location);
      return {
        lat: location.lat,
        lng: location.lng,
        formatted_address: location.formatted,
        place_id: `place_${Date.now()}`,
      };
    }

    // Try partial match
    const matchedKey = Object.keys(mockLocations).find(key => query.includes(key) || key.includes(query));

    if (matchedKey) {
      const matched = mockLocations[matchedKey];
      console.log('[MOCK Maps] Geocode result (partial match):', matched);
      return {
        lat: matched.lat,
        lng: matched.lng,
        formatted_address: matched.formatted,
        place_id: `place_${Date.now()}`,
      };
    }

    // Default: return a generic Nigerian location (Abuja center)
    console.log('[MOCK Maps] Geocode result (default):', query);
    return {
      lat: 9.0765,
      lng: 7.3986,
      formatted_address: request.address || 'Abuja, FCT, Nigeria',
      place_id: `place_${Date.now()}`,
    };
  },

  reverseGeocode: async (request: ReverseGeocodeRequest): Promise<ReverseGeocodeResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Try to find closest match in mock locations
    let closestMatch: { formatted: string; components?: any } | null = null;
    let minDistance = Infinity;

    for (const [key, location] of Object.entries(mockLocations)) {
      const distance = Math.sqrt(
        Math.pow(location.lat - request.lat, 2) + Math.pow(location.lng - request.lng, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestMatch = {
          formatted: location.formatted,
          components: {
            city: key.includes('lagos') ? 'Lagos' : key.includes('abuja') ? 'Abuja' : undefined,
            state: key.includes('lagos')
              ? 'Lagos State'
              : key.includes('abuja')
                ? 'FCT'
                : key.includes('kano')
                  ? 'Kano State'
                  : 'Nigeria',
            country: 'Nigeria',
          },
        };
      }
    }

    const result = closestMatch || {
      formatted: `${request.lat.toFixed(4)}, ${request.lng.toFixed(4)}`,
      components: {
        country: 'Nigeria',
      },
    };

    console.log('[MOCK Maps] Reverse geocode result:', result);

    return {
      formatted_address: result.formatted,
      components: result.components,
      place_id: `place_${Date.now()}`,
    };
  },

  getAddressSuggestions: async (
    query: string,
    location?: { lat: number; lng: number }
  ): Promise<AddressSuggestion[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const queryLower = query.toLowerCase().trim();
    const suggestions: AddressSuggestion[] = [];

    // Filter mock locations based on query
    for (const [key, location] of Object.entries(mockLocations)) {
      if (key.includes(queryLower) || location.formatted.toLowerCase().includes(queryLower)) {
        suggestions.push({
          description: location.formatted,
          place_id: `place_${key}`,
          formatted_address: location.formatted,
        });
      }
    }

    // If no matches, return some generic Nigerian addresses
    if (suggestions.length === 0) {
      suggestions.push(
        {
          description: `${query} - Lagos, Nigeria`,
          place_id: `place_suggest_1`,
        },
        {
          description: `${query} - Abuja, Nigeria`,
          place_id: `place_suggest_2`,
        }
      );
    }

    console.log('[MOCK Maps] Address suggestions:', suggestions);
    return suggestions.slice(0, 5); // Limit to 5 suggestions
  },
};
