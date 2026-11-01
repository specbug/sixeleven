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
    <p className="meta mt-12 mb-2">
      <a href="https://sixeleven.in" target="_blank" rel="noopener noreferrer" className="link">sixeleven.in</a> by{' '}
      <a href="https://github.com/specbug" target="_blank" rel="noopener noreferrer" className="link">Rishit Vora</a> is marked{' '}
      <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer" className="link">
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