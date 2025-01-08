import React from "react";
import { Grid, Typography, Link } from "@strapi/design-system";

interface OverviewItemLinkProps {
  label: string;
  to: string;
}

const OverviewItemLink: React.FC<OverviewItemLinkProps> = (props) => {
  return (
    <Grid.Root padding={1} col={6} s={12}>
      <Grid.Item>
        <Link href={props.to} isExternal>
          <Typography
            variant="sigma"
          textColor="primary600"
          textTransform="uppercase"
        >
          {props.label}
          </Typography>
        </Link>
      </Grid.Item>
    </Grid.Root>
  );
}

export default OverviewItemLink;
