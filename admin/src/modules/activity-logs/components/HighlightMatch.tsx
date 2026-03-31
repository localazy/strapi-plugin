import React from 'react';
import { useTheme } from 'styled-components';

const HighlightMatch: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  const theme = useTheme();
  if (!query) return <>{text}</>;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <span style={{ backgroundColor: theme.colors.warning200, borderRadius: '2px', padding: '0 1px' }}>
        {text.slice(index, index + query.length)}
      </span>
      {text.slice(index + query.length)}
    </>
  );
};

export default HighlightMatch;
