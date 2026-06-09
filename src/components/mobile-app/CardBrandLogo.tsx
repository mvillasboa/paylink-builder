interface CardBrandLogoProps {
  brand: 'visa' | 'mastercard' | 'amex' | 'discover';
  className?: string;
}

export function CardBrandLogo({ brand, className = "" }: CardBrandLogoProps) {
  if (brand === 'visa') {
    return (
      <span className={`font-bold italic tracking-tight ${className}`}>VISA</span>
    );
  }
  if (brand === 'mastercard') {
    return (
      <span className={`inline-flex items-center ${className}`}>
        <span className="w-5 h-5 rounded-full bg-red-500 -mr-2" />
        <span className="w-5 h-5 rounded-full bg-yellow-400 opacity-90" />
      </span>
    );
  }
  if (brand === 'amex') {
    return <span className={`font-bold tracking-tight ${className}`}>AMEX</span>;
  }
  return <span className={`font-bold ${className}`}>{brand.toUpperCase()}</span>;
}
