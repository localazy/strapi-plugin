import React from 'react';
import { useTheme } from 'styled-components';

const HighlightMatch: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  const theme = useTheme();
  if (!query) return <>{text}</>;

  // Escape regex special characters in query
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

  if (parts.length === 1) return <>{text}</>;

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} style={{ backgroundColor: theme.colors.warning200, borderRadius: '2px', padding: '0 1px' }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

export default HighlightMatch;
