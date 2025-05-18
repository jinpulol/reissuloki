import React from 'react';

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
}

const FormInput: React.FC<FormInputProps> = ({ id, label, type = 'text', value, onChange, required, minLength }) => (
  <div>
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      minLength={minLength}
    />
  </div>
);

export default FormInput;
