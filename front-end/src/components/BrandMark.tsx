import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '@/config/brand';
import symbolUrl from '@/assets/brand/zapbusiness-symbol.svg';

interface BrandMarkProps {
  compact?: boolean;
  /** Quando definido, a marca navega para a rota. */
  to?: string;
  className?: string;
}

/** Marca provisória tipográfica + símbolo abstrato (substituível por assets oficiais). */
export const BrandMark: React.FC<BrandMarkProps> = ({
  compact = false,
  to,
  className = '',
}) => {
  const content = (
    <>
      <img src={symbolUrl} alt="" className="brand-mark__symbol" width={36} height={36} aria-hidden />
      {!compact && (
        <span className="brand-mark__text">
          <span className="brand-mark__name">{BRAND.productName}</span>
          <span className="brand-mark__by">by {BRAND.companyShort}</span>
        </span>
      )}
    </>
  );

  const classes = `brand-mark ${compact ? 'brand-mark--compact' : ''} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} title={BRAND.signature} aria-label={BRAND.signature}>
        {content}
      </Link>
    );
  }

  return (
    <div className={classes} title={BRAND.signature} aria-label={BRAND.signature}>
      {content}
    </div>
  );
};

export default BrandMark;
