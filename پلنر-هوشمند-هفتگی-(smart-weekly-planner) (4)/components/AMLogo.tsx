
import React from 'react';

interface AMLogoProps {
  className?: string;
  size?: number;
}

const AMLogo: React.FC<AMLogoProps> = ({ className = "text-indigo-600", size = 24 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Replicating the stylized AM monogram from the image */}
      <path 
        d="M20 80V20L50 60L80 20V80" 
        stroke="currentColor" 
        strokeWidth="12" 
        strokeLinecap="square" 
        strokeLinejoin="miter" 
      />
      <path 
        d="M35 55H65" 
        stroke="currentColor" 
        strokeWidth="12" 
        strokeLinecap="square" 
      />
    </svg>
  );
};

export default AMLogo;
