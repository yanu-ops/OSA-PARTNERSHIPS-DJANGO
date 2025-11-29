import React from 'react';

const Logo = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  };

  return (
    <div
      className={`${sizeClasses[size]} ${className} flex items-center justify-center flex-shrink-0 bg-white overflow-hidden`}
    >
      <img 
        src="/crossians.png" 
        alt="Holy Cross of Davao College" 
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
};


export const Logo1 = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  };

  return (
    <div
      className={`${sizeClasses[size]} ${className} flex items-center justify-center flex-shrink-0 bg-red-700 overflow-hidden`}
    >
      <img 
        src="/crossians.png" 
        alt="Holy Cross of Davao College" 
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
};

export default Logo;
