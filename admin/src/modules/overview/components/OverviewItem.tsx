import React from 'react';
import { Grid, Typography } from '@strapi/design-system';

interface OverviewItemProps {
  label: string;
  value: string;
}

const OverviewItem: React.FC<OverviewItemProps> = (props) => {
  return (
    <Grid.Root padding={1} col={6} s={12}>
      <Grid.Item>
        <Typography variant='sigma' textColor='neutral600' textTransform='uppercase'>
          {props.label}
        </Typography>
      </Grid.Item>
      <Grid.Item>
        <Typography variant='omega' textColor='neutral800' fontWeight='semiBold'>
          {props.value}
        </Typography>
      </Grid.Item>
    </Grid.Root>
  );
};

export default OverviewItem;
