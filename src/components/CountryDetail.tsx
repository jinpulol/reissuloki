import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCountryByCca3 } from '../services/countryService';
import type { Country } from '../services/countryService';
import { getAuth } from 'firebase/auth';
import {
  addCountryToList,
  removeCountryFromList,
  getUserCountryLists
} from '../services/userCountryService';
import {
  addComment,
  getComments,
  updateComment,
  deleteComment,
  type CountryComment
} from '../services/commentService';

const CountryDetail: React.FC = () => {
  const { cca3 } = useParams<{ cca3: string }>();
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLists, setUserLists] = useState<{ visited: string[]; wishlist: string[] }>({ visited: [], wishlist: [] });
  const [comments, setComments] = useState<CountryComment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
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
    }
  }, [user, cca3]);

  useEffect(() => {
    if (cca3) {
      getComments(cca3).then(comments => {
        // Järjestetään aikajärjestykseen (vanhimmat ensin)
        const sorted = [...comments].sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
        setComments(sorted);
      });
    }
  }, [cca3]);

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
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim() || !cca3) return;
    await addComment(cca3, commentText.trim());
    setCommentText('');
    setComments(await getComments(cca3));
  };
  const handleEditComment = async (commentId: string) => {
    if (!user || !editingText.trim()) return;
    await updateComment(commentId, editingText.trim());
    setEditingId(null);
    setEditingText('');
    setComments(await getComments(cca3!));
  };
  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;
    await deleteComment(commentId);
    setComments(await getComments(cca3!));
  };

  if (loading) return <p>Ladataan tietoja...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!country) return <p>Maatietoja ei löytynyt.</p>;

  return (
    <div className="country-detail-layout">
      <div className="country-detail-main">
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
            <div style={{ display: 'flex', gap: 16 }}>
              {userLists.visited.includes(cca3) ? (
                <button onClick={() => handleRemoveFromList('visited')} style={{ background: '#e74c3c', color: 'white' }}>Poista merkintä käynnistäni</button>
              ) : (
                <button onClick={() => handleAddToList('visited')} style={{ background: '#27ae60', color: 'white' }}>Olen käynyt täällä!</button>
              )}
              {userLists.wishlist.includes(cca3) ? (
                <button onClick={() => handleRemoveFromList('wishlist')} style={{ background: '#e74c3c', color: 'white' }}>Poista matka toivelistaltani!</button>
              ) : (
                <button onClick={() => handleAddToList('wishlist')} style={{ background: '#2980ef', color: 'white' }}>Haluan matkustaa tänne!</button>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="country-detail-side">
        {/* Kommentit-osio */}
        <div className="comment-section" style={{ marginTop: 40 }}>
          <h3>Kommentit</h3>
          {user && cca3 && (
            <form onSubmit={handleAddComment} style={{ marginBottom: 16 }}>
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                rows={2}
                style={{ width: '100%', maxWidth: 400 }}
                placeholder="Jätä julkinen kommentti..."
              />
              <button type="submit" style={{ marginTop: 8 }}>Lähetä</button>
            </form>
          )}
          {comments.length === 0 && <p>Ei kommentteja vielä.</p>}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {comments.map(comment => (
              <li key={comment.id} style={{ marginBottom: 16, background: '#f3f7fa', borderRadius: 8, padding: 12 }}>
                <div style={{ fontWeight: 500, color: '#185a9d', marginBottom: 4 }}>{comment.userEmail || 'Tuntematon käyttäjä'}</div>
                {editingId === comment.id ? (
                  <>
                    <textarea
                      value={editingText}
                      onChange={e => setEditingText(e.target.value)}
                      rows={2}
                      style={{ width: '100%', maxWidth: 400 }}
                    />
                    <div style={{ marginTop: 4 }}>
                      <button onClick={() => handleEditComment(comment.id!)} style={{ marginRight: 8 }}>Tallenna</button>
                      <button onClick={() => { setEditingId(null); setEditingText(''); }}>Peruuta</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ marginBottom: 4 }}>{comment.text}</div>
                    {user && user.uid === comment.userId && (
                      <div>
                        <button onClick={() => { setEditingId(comment.id!); setEditingText(comment.text); }} style={{ marginRight: 8, background: '#2980ef', color: 'white' }}>Muokkaa</button>
                        <button onClick={() => handleDeleteComment(comment.id!)} style={{ background: '#e74c3c', color: 'white' }}>Poista</button>
                      </div>
                    )}
                  </>
                )}
                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{comment.createdAt.toDate().toLocaleString('fi-FI')}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;
