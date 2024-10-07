import React from "react";
import { Box, Typography } from "@strapi/design-system";
import { useTranslation } from "react-i18next";

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
