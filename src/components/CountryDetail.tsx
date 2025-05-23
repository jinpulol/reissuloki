import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCountryByCca3 } from '../services/countryService';
import type { Country } from '../services/countryService';
import { auth } from '../firebaseConfig';
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
import CommentList from './CommentList';
import CommentForm from './CommentForm';

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

  const refreshComments = async () => {
    if (cca3) {
      const fetched = await getComments(cca3);
      // Järjestetään aikajärjestykseen (vanhimmat ensin)
      const sorted = [...fetched].sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
      setComments(sorted);
    }
  };

  useEffect(() => {
    refreshComments();
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
    await refreshComments();
  };
  const handleEditComment = async (commentId: string) => {
    if (!user || !editingText.trim()) return;
    await updateComment(commentId, editingText.trim());
    setEditingId(null);
    setEditingText('');
    await refreshComments();
  };
  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;
    await deleteComment(commentId);
    await refreshComments();
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
            <CommentForm
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onSubmit={handleAddComment}
            />
          )}
          {comments.length === 0 && <p>Ei kommentteja vielä.</p>}
          <CommentList
            comments={comments}
            userId={user?.uid}
            editingId={editingId}
            editingText={editingText}
            setEditingId={setEditingId}
            setEditingText={setEditingText}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
          />
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;
