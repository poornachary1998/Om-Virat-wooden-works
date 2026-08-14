'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

/**
 * Shared image carousel.
 * images: [{ url, alt }] — arrows and dots hide automatically when there is only one.
 */
export default function Carousel({ images, ratio = '4x3', autoplayMs = 0, priority = false }) {
  const [i, setI] = useState(0);
  const timer = useRef(null);
  const n = images.length;

  useEffect(() => {
    if (!autoplayMs || n < 2) return;
    timer.current = setInterval(() => setI((v) => (v + 1) % n), autoplayMs);
    return () => clearInterval(timer.current);
  }, [autoplayMs, n]);

  if (!n) return <div className={'frame frame-' + ratio} />;
  const step = (d) => setI((v) => (v + d + n) % n);
  const current = images[i];

  return (
    <div className={'frame frame-' + ratio}>
      <Image
        src={current.url}
        alt={current.alt || ''}
        fill
        sizes="(max-width: 720px) 100vw, 50vw"
        priority={priority}
      />
      {n > 1 && (
        <>
          <button className="arrow arrow-l" aria-label="Previous image" onClick={() => step(-1)}>‹</button>
          <button className="arrow arrow-r" aria-label="Next image" onClick={() => step(1)}>›</button>
          <div className="badge">{i + 1} / {n}</div>
          <div className="dots">
            {images.map((_, k) => <span key={k} className={'dot' + (k === i ? ' on' : '')} />)}
          </div>
        </>
      )}
    </div>
  );
}
