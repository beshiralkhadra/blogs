'use client';

import { createPortal } from 'react-dom';
import { useEffect } from 'react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;           
  footer?: React.ReactNode;        
  children: React.ReactNode;     
  size?: 'sm' | 'md' | 'lg' | 'xl'; 
  closeOnBackdrop?: boolean;
};

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function Modal({
  open,
  onClose,
  title,
  footer,
  children,
  size = 'md',
  closeOnBackdrop = true,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      <div
        className={`relative w-full ${sizes[size]} max-h-[90vh] flex flex-col rounded-xl bg-white shadow-lg ring-1 ring-black/10`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-4 py-3 flex-shrink-0">
          {title ? (
            <h2 id="modal-title" className="text-base font-semibold">
              {title}
            </h2>
          ) : (
            <span aria-hidden />
          )}
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-600
                       hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="px-4 py-3 flex-1 overflow-auto">
          {children}
        </div>

        {footer !== undefined && (
          <div className="border-t px-4 py-3 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
