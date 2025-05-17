import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom'; // Olettaen, että käytät React Routeria navigointiin
import { getAllCountriesSummary } from '../services/countryService';
// import { getAllCountriesSummary, searchCountriesByName, getCountriesByRegion } from '../services/countryService';
import type { Country } from '../services/countryService';
import './CountryList.css'; // CSS-tyyleille

type SummaryCountry = Pick<Country, 'name' | 'cca3' | 'flags' | 'population' | 'region' | 'capital'>;

const CountryList: React.FC = () => {
  const [allCountries, setAllCountries] = useState<SummaryCountry[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<SummaryCountry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');


  useEffect(() => {
    const fetchInitialCountries = async () => {
      try {
        setLoading(true);
        const data = await getAllCountriesSummary();
        setAllCountries(data);
        setFilteredCountries(data); // Aluksi näytetään kaikki
        setError(null);
      } catch (err) {
        setError("Maiden tietoja ei voitu ladata. Yritä myöhemmin uudelleen.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialCountries();
  }, []);

  const regions = useMemo(() => {
    const uniqueRegions = new Set(allCountries.map(country => country.region).sort());
    return Array.from(uniqueRegions);
  }, [allCountries]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm && !selectedRegion) {
        setFilteredCountries(allCountries);
        return;
    }
    setLoading(true);
    setError(null);
    try {
        let results: SummaryCountry[] = [];
        if (searchTerm) {
            // API:n hakutoiminto on suppeampi, joten haetaan kaikki ja suodatetaan asiakaspuolella tarkemmin,
            // tai käytetään API:n hakua ja yhdistetään tulokset.
            // Yksinkertaisuuden vuoksi suodatetaan jo ladatuista.
            results = allCountries.filter(country =>
                country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (country.capital && country.capital.join(', ').toLowerCase().includes(searchTerm.toLowerCase()))
            );
        } else {
            results = [...allCountries]; // Käytä kaikkia maita, jos hakusana on tyhjä
        }


        if (selectedRegion) {
            results = results.filter(country => country.region === selectedRegion);
        }
        setFilteredCountries(results);
    } catch (err) {
        setError("Haussa tapahtui virhe.");
        console.error(err);
        setFilteredCountries([]);
    } finally {
        setLoading(false);
    }
  };


  if (loading && filteredCountries.length === 0) { // Näytä lataus vain, jos ei ole vielä dataa
    return <p>Ladataan maita...</p>;
  }

  if (error) {
    return <p role="alert" style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="country-list-container">
      <h1>Tutustu Maailman Maihin</h1>
      <form onSubmit={handleSearch} className="filter-form">
        <div className="form-group">
            <label htmlFor="search-term">Hae maan tai pääkaupungin nimellä:</label>
            <input
                id="search-term"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Esim. Finland tai Helsinki"
            />
        </div>
        <div className="form-group">
            <label htmlFor="region-select">Suodata maanosan mukaan:</label>
            <select
                id="region-select"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
            >
                <option value="">Kaikki maanosat</option>
                {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                ))}
            </select>
        </div>
        <button type="submit" disabled={loading}>
            {loading ? 'Haetaan...' : 'Hae / Suodata'}
        </button>
      </form>

      {filteredCountries.length === 0 && !loading && <p>Ei hakutuloksia.</p>}

      <div className="country-grid" aria-live="polite">
        {filteredCountries.map((country) => (
          <Link to={`/country/${country.cca3}`} key={country.cca3} className="country-card">
            <img src={country.flags.svg} alt={`Lippu: ${country.name.common}`} loading="lazy" />
            <div className="card-content">
                <h2>{country.name.common}</h2>
                <p>Pääkaupunki: {country.capital?.[0] || 'Ei tietoa'}</p>
                <p>Väkiluku: {country.population.toLocaleString('fi-FI')}</p>
                <p>Maanosa: {country.region}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CountryList;