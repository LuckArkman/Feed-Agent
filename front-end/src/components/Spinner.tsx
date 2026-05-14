import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  return (
    <div className={`spinner-container ${className}`}>
      <span className={`spinner spinner-${size}`} />
    </div>
  );
};
export default Spinner;
