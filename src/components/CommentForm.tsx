import React from 'react';

interface CommentFormProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({ value, onChange, onSubmit, disabled }) => (
  <form onSubmit={onSubmit} style={{ marginBottom: 16 }}>
    <textarea
      value={value}
      onChange={onChange}
      rows={2}
      style={{ width: '100%', maxWidth: 400 }}
      placeholder="Jätä julkinen kommentti..."
      disabled={disabled}
    />
    <button type="submit" style={{ marginTop: 8 }} disabled={disabled}>Lähetä</button>
  </form>
);

export default CommentForm;
