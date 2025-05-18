import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { getUserCountryLists } from '../services/userCountryService';
import { getAllCountriesSummary } from '../services/countryService';
import type { Country } from '../services/countryService';
import CountryCard from './CountryCard';

const VisitedCountries: React.FC = () => {
  const [countries, setCountries] = useState<Pick<Country, 'name' | 'cca3' | 'flags' | 'population' | 'region' | 'capital'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchVisited = async () => {
      setLoading(true);
      setError(null);
      try {
        if (user) {
          const lists = await getUserCountryLists(user);
          const all = await getAllCountriesSummary();
          const filtered = all.filter(c => lists.visited.includes(c.cca3));
          // Järjestetään aakkosjärjestykseen nimen mukaan
          setCountries(filtered.sort((a, b) => a.name.common.localeCompare(b.name.common)));
        }
      } catch (err) {
        setError('Käytyjen maiden hakeminen epäonnistui.');
      } finally {
        setLoading(false);
      }
    };
    fetchVisited();
  }, [user]);

  if (!user) return <p>Kirjaudu sisään nähdäksesi käydyt maat.</p>;
  if (loading) return <p>Ladataan käytyjä maita...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="country-list-container">
      <h1>Käymäni maat</h1>
      {countries.length === 0 ? (
        <p>Et ole vielä merkinnyt käytyjä maita.</p>
      ) : (
        <div className="country-grid">
          {countries.map(country => (
            <CountryCard key={country.cca3} country={country} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VisitedCountries;
