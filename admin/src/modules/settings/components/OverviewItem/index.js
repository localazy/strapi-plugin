/*
 *
 * OverviewItem
 *
 */

import React from "react";
import { GridItem } from '@strapi/design-system/Grid';
import { Box } from "@strapi/design-system/Box";
import { Typography } from "@strapi/design-system/Typography";
import PropTypes from "prop-types";

function OverviewItem(props) {

  return (
    <GridItem padding={1} col={6} s={12}>
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
    </GridItem>
  );
}

OverviewItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default OverviewItem;
