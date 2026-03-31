import React from 'react';
import { Flex, Typography } from '@strapi/design-system';
import { CaretUp, CaretDown } from '@strapi/icons';
import type { SortKey, SortDirection } from '../models/activity-logs';

const SortableHeader: React.FC<{
  label: string;
  sortKey: SortKey;
  activeSortKey: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
}> = ({ label, sortKey, activeSortKey, direction, onSort }) => {
  const isActive = sortKey === activeSortKey;
  return (
    <th
      onClick={() => onSort(sortKey)}
      style={{
        textAlign: 'left',
        padding: '12px 16px',
        borderBottom: '1px solid #eaeaef',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <Flex alignItems='center' gap={1}>
        <Typography variant='sigma' textColor={isActive ? 'primary600' : 'neutral600'}>
          {label}
        </Typography>
        <span style={{ width: 8, display: 'inline-flex', flexShrink: 0 }}>
          {isActive && (direction === 'asc' ? <CaretUp width={8} height={8} /> : <CaretDown width={8} height={8} />)}
        </span>
      </Flex>
    </th>
  );
};

export default SortableHeader;
