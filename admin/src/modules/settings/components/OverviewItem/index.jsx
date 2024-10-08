/*
 *
 * OverviewItem
 *
 */

import React from "react";
import { Box, Typography } from '@strapi/design-system';
import PropTypes from "prop-types";

function OverviewItem(props) {

  return (
    <Grid.Item padding={1} col={6} s={12}>
      <Box>
        <Typography
          variant="sigma"
          textColor="neutral600"
          textTransform="uppercase"
        >
          {props.label}
        </Typography>
      </Box>
      <Box>
        <Typography
          variant="omega"
          textColor="neutral800"
          fontWeight="semiBold"
        >
          {props.value}
        </Typography>
      </Box>
    </Grid.Item>
  );
}

OverviewItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default OverviewItem;
