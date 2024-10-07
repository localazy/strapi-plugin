/*
 *
 * OpenProjectInLocalalazy
 *
 */

import React from "react";
import {
  GridItem,
  Typography,
  Link
 } from '@strapi/design-system';
import PropTypes from "prop-types";

function OverviewItemLink(props) {
  return (
    <GridItem padding={1} col={6} s={12}>
      <Link href={props.to} isExternal>
        <Typography
          variant="sigma"
          textColor="primary600"
          textTransform="uppercase"
        >
          {props.label}
        </Typography>
      </Link>
    </GridItem>
  );
}

OverviewItemLink.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default OverviewItemLink;
