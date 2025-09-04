'use client';

import Link from 'next/link';

type FloatingBtnProps = {
  href?: string;
  onClick?: () => void;
  svg: React.ReactNode;
  ariaLabel?: string;
};

export function FloatingBtn({ href, onClick, svg, ariaLabel = "Action button" }: FloatingBtnProps) {
  const buttonClasses = "fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50";

  if (href) {
    return (
      <Link
        href={href}
        className={buttonClasses}
        aria-label={ariaLabel}
      >
        {svg}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={buttonClasses}
        aria-label={ariaLabel}
      >
        {svg}
      </button>
    );
  }

  return (
    <button
      disabled
      className={`${buttonClasses} opacity-50 cursor-not-allowed`}
      aria-label={ariaLabel}
    >
      {svg}
    </button>
  );
}