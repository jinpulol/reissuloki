import axios from 'axios';

const API_BASE_URL = 'https://restcountries.com/v3.1';

export interface CountryName {
  common: string;
  official: string;
  nativeName?: {
    [key: string]: {
      official: string;
      common: string;
    };
  };
}

export interface Currency {
  name: string;
  symbol: string;
}

export interface Flags {
  png: string;
  svg: string;
  alt?: string;
}

export interface CoatOfArms {
  png?: string;
  svg?: string;
}

export interface Maps {
  googleMaps: string;
  openStreetMaps: string;
}

export interface Country {
  name: CountryName;
  cca2: string; // esim. FI
  cca3: string; // esim. FIN
  cioc?: string; // esim. FIN (Olympic Committee)
  independent?: boolean;
  status: string;
  unMember: boolean;
  currencies?: { [key: string]: Currency };
  capital?: string[];
  altSpellings: string[];
  region: string; // Esim. Europe
  subregion?: string; // Esim. Northern Europe
  languages?: { [key: string]: string };
  translations: { [key: string]: { official: string; common: string } };
  latlng: [number, number];
  landlocked: boolean;
  borders?: string[]; // Naapurimaiden cca3-koodit
  area: number;
  demonyms?: { [key: string]: { f: string; m: string } };
  flag: string; // Emoji lippu
  maps: Maps;
  population: number;
  gini?: { [key: string]: number }; // Vuosi: arvo
  fifa?: string;
  car: { signs?: string[]; side: string };
  timezones: string[];
  continents: string[];
  flags: Flags;
  coatOfArms: CoatOfArms;
  startOfWeek: string;
  capitalInfo?: { latlng?: [number, number] };
  postalCode?: { format: string; regex?: string };
}


// Hae kaikki maat (valikoiduilla kentillä listanäkymää varten)
export const getAllCountriesSummary = async (): Promise<Pick<Country, 'name' | 'cca3' | 'flags' | 'population' | 'region' | 'capital'>[]> => {
  try {
    const response = await axios.get<Pick<Country, 'name' | 'cca3' | 'flags' | 'population' | 'region' | 'capital'>[]>(
      `${API_BASE_URL}/all?fields=name,cca3,flags,population,region,capital`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all countries summary:", error);
    throw error;
  }
};

// Hae yksittäisen maan kaikki tiedot cca3-koodilla
export const getCountryByCca3 = async (cca3Code: string): Promise<Country | null> => {
  try {
    const response = await axios.get<Country[]>(`${API_BASE_URL}/alpha/${cca3Code}`);
    return response.data[0] || null;
  } catch (error) {
    console.error(`Error fetching country by cca3 code ${cca3Code}:`, error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null; // Maa ei löytynyt
    }
    throw error;
  }
};

// Hae maita nimen perusteella
export const searchCountriesByName = async (name: string): Promise<Country[]> => {
    try {
        const response = await axios.get<Country[]>(`${API_BASE_URL}/name/${name}?fields=name,cca3,flags,population,region,capital`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return []; // Palautetaan tyhjä taulukko jos mitään ei löydy
        }
        console.error(`Error searching countries by name "${name}":`, error);
        throw error;
    }
};

// Hae maita maanosan (region) perusteella
export const getCountriesByRegion = async (region: string): Promise<Pick<Country, 'name' | 'cca3' | 'flags' | 'population' | 'region' | 'capital'>[]> => {
    try {
        const response = await axios.get<Pick<Country, 'name' | 'cca3' | 'flags' | 'population' | 'region' | 'capital'>[]>(
            `${API_BASE_URL}/region/${region}?fields=name,cca3,flags,population,region,capital`
        );
        return response.data;
    } catch (error) {
        console.error(`Error fetching countries by region "${region}":`, error);
        throw error;
    }
};