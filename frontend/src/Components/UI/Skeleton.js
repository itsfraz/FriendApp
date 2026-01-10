import React from 'react';

const Skeleton = ({ className = '', variant = 'text' }) => {
  const baseClasses = "animate-shimmer rounded bg-gray-200 dark:bg-gray-700";
  
  let variantClasses = "";
  switch (variant) {
    case 'circle':
      variantClasses = "rounded-full flex-shrink-0";
      break;
    case 'rect':
      variantClasses = "";
      break;
    case 'text':
    default:
      variantClasses = "";
      break;
  }

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`} />
  );
};

export default Skeleton;
