'use client';
import { useEffect } from 'react';
import Image from 'next/image';

/** Full-screen popup showing one image at full size. Closes on backdrop click, close button, or Escape. */
export default function Lightbox({ image, onClose }) {
  useEffect(() => {
    if (!image) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox-close" aria-label="Close" onClick={onClose}>✕</button>
      <div className="lightbox-frame" onClick={(e) => e.stopPropagation()}>
        <Image src={image.url} alt={image.alt || ''} fill sizes="100vw" style={{ objectFit: 'contain' }} />
      </div>
    </div>
  );
}
