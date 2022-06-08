import React from "react";
import { Box } from "@strapi/design-system/Box";
import { useTranslation } from "react-i18next";
import { Typography } from "@strapi/design-system/Typography";

import "../../../../i18n";

function PrerequisitiesInfo() {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="omega" fontWeight="semiBold">
        {t("settings.internationalization_plugin")}
      </Typography>
      <Typography variant="omega">
        {t("settings.has_to_be_installed")}
      </Typography>
      <br />
      <Typography variant="omega">
        {t("settings.transfer_setup_message_a")}
      </Typography>
      <Typography variant="omega" fontWeight="semiBold">
        {t("settings.transfer_setup_message_b")}
      </Typography>
    </Box>
  );
}

export default PrerequisitiesInfo;
