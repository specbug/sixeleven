import React from 'react';

export function CreativeCommons() {
  const imgStyle: React.CSSProperties = {
    maxWidth: '1em',
    maxHeight: '1em',
    marginLeft: '.2em',
    display: 'inline-block',
    verticalAlign: 'middle',
  };

  return (
    <p className="mt-6 mb-2 text-sm text-[var(--foreground-muted)]">
      <a href="https://sixeleven.in" target="_blank" rel="noopener noreferrer" className="text-[var(--foreground-muted)] underline decoration-[var(--braun-orange)] decoration-1 underline-offset-[0.2em] hover:text-[var(--braun-orange)] transition-colors">sixeleven.in</a> by{' '}
      <a href="https://github.com/specbug" target="_blank" rel="noopener noreferrer" className="text-[var(--foreground-muted)] underline decoration-[var(--braun-orange)] decoration-1 underline-offset-[0.2em] hover:text-[var(--braun-orange)] transition-colors">Rishit Vora</a> is marked{' '}
      <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer" className="text-[var(--foreground-muted)] underline decoration-[var(--braun-orange)] decoration-1 underline-offset-[0.2em] hover:text-[var(--braun-orange)] transition-colors">
        CC0 1.0
      </a>
      <img
        src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"
        style={imgStyle}
        alt="CC"
      />
      <img
        src="https://mirrors.creativecommons.org/presskit/icons/zero.svg"
        style={imgStyle}
        alt="Zero"
      />
    </p>
  );
} 