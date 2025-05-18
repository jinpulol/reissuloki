import React from 'react';
import type { CountryComment } from '../services/commentService';

interface CommentListProps {
  comments: CountryComment[];
  userId?: string;
  editingId: string | null;
  editingText: string;
  setEditingId: (id: string | null) => void;
  setEditingText: (text: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  userId,
  editingId,
  editingText,
  setEditingId,
  setEditingText,
  onEdit,
  onDelete
}) => (
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
              <button onClick={() => onEdit(comment.id!)} style={{ marginRight: 8 }}>Tallenna</button>
              <button onClick={() => { setEditingId(null); setEditingText(''); }}>Peruuta</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 4 }}>{comment.text}</div>
            {userId === comment.userId && (
              <div>
                <button onClick={() => { setEditingId(comment.id!); setEditingText(comment.text); }} style={{ marginRight: 8, background: '#2980ef', color: 'white' }}>Muokkaa</button>
                <button onClick={() => onDelete(comment.id!)} style={{ background: '#e74c3c', color: 'white' }}>Poista</button>
              </div>
            )}
          </>
        )}
        <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{comment.createdAt.toDate().toLocaleString('fi-FI')}</div>
      </li>
    ))}
  </ul>
);

export default CommentList;
