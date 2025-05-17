import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getUserCountryLists } from '../services/userCountryService';
import { getAllCountriesSummary } from '../services/countryService';
import type { Country } from '../services/countryService';
import { Link } from 'react-router-dom';

const WishlistCountries: React.FC = () => {

  const [countries, setCountries] = useState<Pick<Country, 'name' | 'cca3' | 'flags' | 'population' | 'region' | 'capital'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      setError(null);
      try {
        if (user) {
          const lists = await getUserCountryLists(user);
          const all = await getAllCountriesSummary();
          const filtered = all.filter(c => lists.wishlist.includes(c.cca3));
          // Järjestetään aakkosjärjestykseen nimen mukaan
          setCountries(filtered.sort((a, b) => a.name.common.localeCompare(b.name.common)));
        }
      } catch (err) {
        setError('Toivelistan hakeminen epäonnistui.');
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user]);

  if (!user) return <p>Kirjaudu sisään nähdäksesi toivelistan maat.</p>;
  if (loading) return <p>Ladataan toivelistan maita...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="country-list-container">
      <h1>Haluan matkustaa tänne</h1>
      {countries.length === 0 ? (
        <p>Et ole vielä lisännyt maita toivelistalle.</p>
      ) : (
        <div className="country-grid">
          {countries.map(country => (
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
      )}
    </div>
  );
};

export default WishlistCountries;
