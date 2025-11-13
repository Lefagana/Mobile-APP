import Constants from 'expo-constants';

const GOOGLE_KEY = (Constants.expoConfig?.extra as any)?.googleMapsApiKey || process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const mockSuggestions = [
  'Lekki Phase 1, Lagos',
  'Victoria Island, Lagos',
  'Ikeja GRA, Lagos',
  'Yaba, Lagos',
  'Garki, Abuja',
  'Wuse 2, Abuja',
  'Maitama, Abuja',
];

export interface PlaceSuggestion {
  description: string;
  place_id?: string;
}

export async function fetchPlaceSuggestions(query: string): Promise<PlaceSuggestion[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  // If no key, return filtered mock suggestions
  if (!GOOGLE_KEY) {
    const q = trimmed.toLowerCase();
    return mockSuggestions
      .filter((s) => s.toLowerCase().includes(q))
      .slice(0, 5)
      .map((s) => ({ description: s }));
  }

  try {
    const params = new URLSearchParams({
      input: trimmed,
      key: GOOGLE_KEY,
      components: 'country:ng',
      types: 'address',
      language: 'en',
      region: 'ng',
    });
    const resp = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?${params.toString()}`);
    const data = await resp.json();
    if (data?.status !== 'OK') {
      // fallback to mock on quota/errors
      return mockSuggestions
        .filter((s) => s.toLowerCase().includes(trimmed.toLowerCase()))
        .slice(0, 5)
        .map((s) => ({ description: s }));
    }
    return (data.predictions || []).map((p: any) => ({ description: p.description, place_id: p.place_id }));
  } catch (e) {
    // network error fallback
    const q = trimmed.toLowerCase();
    return mockSuggestions
      .filter((s) => s.toLowerCase().includes(q))
      .slice(0, 5)
      .map((s) => ({ description: s }));
  }
}

export async function fetchPlaceDetails(placeId: string): Promise<any | null> {
  if (!GOOGLE_KEY || !placeId) return null;
  try {
    const params = new URLSearchParams({ key: GOOGLE_KEY, place_id: placeId, language: 'en' });
    const resp = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`);
    const data = await resp.json();
    if (data?.status !== 'OK') return null;
    return data.result;
  } catch {
    return null;
  }
}
