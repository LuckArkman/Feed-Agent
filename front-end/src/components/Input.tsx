import React, { useId } from 'react';
import type { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon: Icon,
  helperText,
  className = '',
  disabled,
  ...props
}) => {
  const id = useId();

  return (
    <div className={`input-group ${error ? 'input-group-error' : ''} ${disabled ? 'input-group-disabled' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <div className="input-container">
        {Icon && <Icon className="input-icon-left" size={18} />}
        <input
          id={id}
          className={`form-input ${Icon ? 'form-input-with-icon' : ''}`}
          disabled={disabled}
          {...props}
        />
      </div>
      {error && <p className="input-error-msg">{error}</p>}
      {!error && helperText && <p className="input-helper-msg">{helperText}</p>}
    </div>
  );
};
export default Input;
