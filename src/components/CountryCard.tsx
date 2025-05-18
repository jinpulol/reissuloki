import React from 'react';
import { Link } from 'react-router-dom';
import type { Country } from '../services/countryService';

interface CountryCardProps {
  country: Pick<Country, 'name' | 'cca3' | 'flags' | 'population' | 'region' | 'capital'>;
}

const CountryCard: React.FC<CountryCardProps> = ({ country }) => (
  <Link to={`/country/${country.cca3}`} className="country-card">
    <img src={country.flags.svg} alt={`Lippu: ${country.name.common}`} loading="lazy" />
    <div className="card-content">
      <h2>{country.name.common}</h2>
      <p>Pääkaupunki: {country.capital?.[0] || 'Ei tietoa'}</p>
      <p>Väkiluku: {country.population.toLocaleString('fi-FI')}</p>
      <p>Maanosa: {country.region}</p>
    </div>
  </Link>
);

export default CountryCard;
