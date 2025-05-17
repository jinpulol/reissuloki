import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCountryByCca3 } from '../services/countryService';
import type { Country } from '../services/countryService';
import { getAuth } from 'firebase/auth';
import {
  addCountryToList,
  removeCountryFromList,
  getUserCountryLists,
  setCountryNote,
  getCountryNote
} from '../services/userCountryService';

const CountryDetail: React.FC = () => {
  const { cca3 } = useParams<{ cca3: string }>();
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLists, setUserLists] = useState<{ visited: string[]; wishlist: string[] }>({ visited: [], wishlist: [] });
  const [note, setNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchCountry = async () => {
      setLoading(true);
      setError(null);
      try {
        if (cca3) {
          const data = await getCountryByCca3(cca3);
          setCountry(data);
        }
      } catch (err) {
        setError('Maan tietoja ei voitu hakea.');
      } finally {
        setLoading(false);
      }
    };
    fetchCountry();
  }, [cca3]);

  useEffect(() => {
    if (user && cca3) {
      getUserCountryLists(user).then(setUserLists);
      getCountryNote(user, cca3).then(setNote);
    }
  }, [user, cca3]);

  const handleAddToList = async (list: 'visited' | 'wishlist') => {
    if (user && cca3) {
      await addCountryToList(user, list, cca3);
      getUserCountryLists(user).then(setUserLists);
    }
  };
  const handleRemoveFromList = async (list: 'visited' | 'wishlist') => {
    if (user && cca3) {
      await removeCountryFromList(user, list, cca3);
      getUserCountryLists(user).then(setUserLists);
    }
  };
  const handleNoteSave = async () => {
    if (user && cca3) {
      await setCountryNote(user, cca3, note);
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 1500);
    }
  };

  if (loading) return <p>Ladataan tietoja...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!country) return <p>Maatietoja ei löytynyt.</p>;

  return (
    <div className="country-detail-container">
      <Link to="/countries">← Takaisin listaan</Link>
      <h1>{country.name.common}</h1>
      <img src={country.flags.svg} alt={`Lippu: ${country.name.common}`} style={{ maxWidth: 200 }} />
      {country.coatOfArms?.svg && (
        <div>
          <h3>Vaakuna</h3>
          <img src={country.coatOfArms.svg} alt={`Vaakuna: ${country.name.common}`} style={{ maxWidth: 150 }} />
        </div>
      )}
      <p><strong>Pääkaupunki:</strong> {country.capital?.join(', ') || 'Ei tietoa'}</p>
      <p><strong>Väkiluku:</strong> {country.population.toLocaleString('fi-FI')}</p>
      <p><strong>Pinta-ala:</strong> {country.area.toLocaleString('fi-FI')} km²</p>
      <p><strong>Maanosa:</strong> {country.region} ({country.subregion})</p>
      <p><strong>Valuutat:</strong> {country.currencies ? Object.values(country.currencies).map(c => c.name + (c.symbol ? ` (${c.symbol})` : '')).join(', ') : 'Ei tietoa'}</p>
      <p><strong>Kielet:</strong> {country.languages ? Object.values(country.languages).join(', ') : 'Ei tietoa'}</p>
      <p><strong>Rajanaapurit:</strong> {country.borders?.length ? country.borders.join(', ') : 'Ei'}</p>
      <p><a href={country.maps.googleMaps} target="_blank" rel="noopener noreferrer">Avaa Google Mapsissa</a></p>
      {user && cca3 && (
        <div style={{ marginTop: 32 }}>
          <h3>Omat toiminnot</h3>
          <div style={{ display: 'flex', gap: 16 }}>
            {userLists.visited.includes(cca3) ? (
              <button onClick={() => handleRemoveFromList('visited')}>Poista "Käynyt täällä"</button>
            ) : (
              <button onClick={() => handleAddToList('visited')}>Lisää "Käynyt täällä"</button>
            )}
            {userLists.wishlist.includes(cca3) ? (
              <button onClick={() => handleRemoveFromList('wishlist')}>Poista "Haluan matkustaa tänne"</button>
            ) : (
              <button onClick={() => handleAddToList('wishlist')}>Lisää "Haluan matkustaa tänne"</button>
            )}
          </div>
          <div style={{ marginTop: 16 }}>
            <label htmlFor="note">Omat muistiinpanot:</label>
            <textarea
              id="note"
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              style={{ width: '100%', maxWidth: 400 }}
            />
            <button onClick={handleNoteSave} style={{ marginTop: 8 }}>Tallenna muistiinpano</button>
            {noteSaved && <span style={{ color: 'green', marginLeft: 8 }}>Tallennettu!</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryDetail;
